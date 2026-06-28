import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const GATEWAY = "https://connector-gateway.lovable.dev/notion/v1";

function notionHeaders() {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
  if (!NOTION_API_KEY) throw new Error("NOTION_API_KEY not configured");
  return {
    "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": NOTION_API_KEY,
    "Content-Type": "application/json",
  };
}

async function notion(path: string, init?: { method?: string; body?: unknown }) {
  const res = await fetch(`${GATEWAY}${path}`, {
    method: init?.method ?? "POST",
    headers: notionHeaders(),
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Notion ${path} [${res.status}]: ${JSON.stringify(json)}`);
  return json;
}

export const getDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("notes")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    return {
      id: row.id as string,
      title: row.title as string,
      subject: row.subject as string | null,
      summary: row.summary as string | null,
      body: row.body as string | null,
      tags: (row.tags ?? []) as string[],
      raw_transcript: row.raw_transcript as string | null,
      source: row.source as string,
      source_url: (row.source_url ?? null) as string | null,
      cover_image_url: (row.cover_image_url ?? null) as string | null,
      audio_duration_s: row.audio_duration_s as number | null,
      captured_at: row.captured_at as string,
      status: row.status as "draft" | "synced" | "failed",
      notion_page_url: row.notion_page_url as string | null,
    };
  });

export const updateDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      subject: z.string().nullable().optional(),
      summary: z.string().nullable().optional(),
      body: z.string(),
      tags: z.array(z.string()),
    }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("notes")
      .update({
        title: data.title,
        subject: data.subject || null,
        summary: data.summary || null,
        body: data.body,
        tags: data.tags,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("notes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Find or create the Brain database under user's parent page
async function getOrCreateBrainDb(userId: string, contextSupabase: { from: (t: string) => { select: (s: string) => { eq: (k: string, v: string) => { single: () => Promise<{ data: { notion_database_id: string | null; notion_parent_page_id: string | null } | null; error: unknown }> } } } & { update: (v: Record<string, unknown>) => { eq: (k: string, v: string) => Promise<unknown> } } }): Promise<string> {
  const { data: s } = await contextSupabase.from("user_settings").select("notion_database_id,notion_parent_page_id").eq("user_id", userId).single();
  if (s?.notion_database_id) return s.notion_database_id;

  // Find a parent page: search for any page the integration has access to
  const search = await notion(`/search`, {
    body: { filter: { value: "page", property: "object" }, page_size: 5 },
  }) as { results: Array<{ id: string; object: string; parent?: { type?: string } }> };

  const parentPage = search.results.find((r) => r.object === "page");
  if (!parentPage) {
    throw new Error("No accessible Notion page found. Share a page with the Lovable integration in Notion, then try again.");
  }

  // Create the Brain database
  const created = await notion(`/databases`, {
    body: {
      parent: { type: "page_id", page_id: parentPage.id },
      icon: { type: "emoji", emoji: "🧠" },
      title: [{ type: "text", text: { content: "Brain" } }],
      properties: {
        Title: { title: {} },
        Subject: { select: {} },
        Tags: { multi_select: {} },
        Captured: { date: {} },
        Summary: { rich_text: {} },
        Source: { select: { options: [{ name: "voice", color: "orange" }, { name: "typed", color: "purple" }] } },
        "Duration (s)": { number: { format: "number" } },
      },
    },
  }) as { id: string };

  await contextSupabase.from("user_settings").update({
    notion_database_id: created.id,
    notion_parent_page_id: parentPage.id,
  }).eq("user_id", userId);

  return created.id;
}

export const syncDraftToNotion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: note, error } = await context.supabase
      .from("notes").select("*").eq("id", data.id).single();
    if (error || !note) throw new Error(error?.message ?? "Note not found");

    try {
      const dbId = await getOrCreateBrainDb(context.userId, context.supabase as never);

      const properties: Record<string, unknown> = {
        Title: { title: [{ text: { content: note.title || "Untitled" } }] },
        Captured: { date: { start: note.captured_at } },
        Source: { select: { name: note.source } },
      };
      if (note.subject) properties.Subject = { select: { name: note.subject } };
      if (note.tags?.length) properties.Tags = { multi_select: (note.tags as string[]).map((n) => ({ name: n })) };
      if (note.summary) properties.Summary = { rich_text: [{ text: { content: note.summary } }] };
      if (note.audio_duration_s != null) properties["Duration (s)"] = { number: Math.round(note.audio_duration_s) };

      // Convert body markdown to simple paragraph blocks
      const bodyText = (note.body as string | null) ?? "";
      const blocks = bodyText.split(/\n\n+/).filter(Boolean).slice(0, 90).map((para) => ({
        object: "block",
        type: "paragraph",
        paragraph: { rich_text: [{ type: "text", text: { content: para.slice(0, 1900) } }] },
      }));

      // Append raw transcript toggle
      if (note.raw_transcript) {
        blocks.push({
          object: "block",
          type: "toggle" as never,
          // @ts-expect-error notion api union
          toggle: {
            rich_text: [{ type: "text", text: { content: "Raw transcript" } }],
            children: [
              {
                object: "block",
                type: "paragraph",
                paragraph: { rich_text: [{ type: "text", text: { content: (note.raw_transcript as string).slice(0, 1900) } }] },
              },
            ],
          },
        });
      }

      const created = await notion(`/pages`, {
        body: { parent: { database_id: dbId }, properties, children: blocks },
      }) as { id: string; url: string };

      await context.supabase.from("notes").update({
        status: "synced",
        notion_page_id: created.id,
        notion_page_url: created.url,
        sync_error: null,
      }).eq("id", data.id);

      return { ok: true, url: created.url };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await context.supabase.from("notes").update({
        status: "failed",
        sync_error: msg,
      }).eq("id", data.id);
      throw new Error(msg);
    }
  });
