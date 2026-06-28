import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Formatted = {
  title: string;
  subject: string;
  summary: string;
  body: string;
  tags: string[];
};

async function callAI(system: string, user: string, model = "google/gemini-2.5-flash"): Promise<Formatted> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY not configured");

  const res = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "inspiration",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              subject: { type: "string" },
              summary: { type: "string" },
              body: { type: "string" },
              tags: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 8 },
            },
            required: ["title", "subject", "summary", "body", "tags"],
          },
        },
      },
    }),
  });
  if (res.status === 429) throw new Error("Rate limited — try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted. Top up in workspace settings.");
  if (!res.ok) throw new Error(`AI failed [${res.status}]: ${await res.text()}`);
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");
  return JSON.parse(content) as Formatted;
}

const SYSTEM_BASE = `You turn raw source material into a structured "Inspiration Record".
- title: a punchy 3-8 word title that captures the essence
- subject: ONE short noun-phrase category (e.g. "design", "product", "marketing", "personal")
- summary: one tight sentence (max 160 chars)
- body: cleaned-up prose in markdown with headings/bullets where useful
- tags: 2-5 lowercase single-word tags
Return ONLY valid JSON, no markdown fences.`;

// ──────────────────────────────────────────────────────────────────────────────
// TEXT
// ──────────────────────────────────────────────────────────────────────────────
export const formatText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      text: z.string().min(1).max(50_000),
      capturedAt: z.string(),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    return callAI(SYSTEM_BASE, `Captured at: ${data.capturedAt}\n\nRaw text:\n${data.text}`);
  });

// ──────────────────────────────────────────────────────────────────────────────
// LINK — fetch + extract + format
// ──────────────────────────────────────────────────────────────────────────────
function extractMeta(html: string) {
  const pick = (re: RegExp) => html.match(re)?.[1]?.trim();
  const decode = (s: string | undefined) =>
    s?.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

  const title = decode(
    pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
      pick(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i) ||
      pick(/<title>([^<]+)<\/title>/i)
  ) ?? "";

  const description = decode(
    pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
      pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
  ) ?? "";

  const image = pick(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
    pick(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ?? "";

  // Strip scripts/styles, take a chunk of body text
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 6000);

  return { title, description, image, body: stripped };
}

// ──────────────────────────────────────────────────────────────────────────────
// Web video / oEmbed detection
// ──────────────────────────────────────────────────────────────────────────────
type VideoKind = "youtube" | "vimeo" | "loom" | "tiktok" | "twitter" | null;

function detectVideoKind(rawUrl: string): VideoKind {
  try {
    const u = new URL(rawUrl);
    const h = u.hostname.replace(/^www\./, "");
    if (h === "youtube.com" || h === "m.youtube.com" || h === "youtu.be" || h === "youtube-nocookie.com") return "youtube";
    if (h === "vimeo.com" || h.endsWith(".vimeo.com")) return "vimeo";
    if (h === "loom.com" || h.endsWith(".loom.com")) return "loom";
    if (h === "tiktok.com" || h.endsWith(".tiktok.com")) return "tiktok";
    if (h === "twitter.com" || h === "x.com" || h.endsWith(".twitter.com") || h.endsWith(".x.com")) return "twitter";
  } catch { /* noop */ }
  return null;
}

function oEmbedEndpoint(kind: NonNullable<VideoKind>, target: string): string {
  const enc = encodeURIComponent(target);
  switch (kind) {
    case "youtube": return `https://www.youtube.com/oembed?url=${enc}&format=json`;
    case "vimeo":   return `https://vimeo.com/api/oembed.json?url=${enc}`;
    case "loom":    return `https://www.loom.com/v1/oembed?url=${enc}&format=json`;
    case "tiktok":  return `https://www.tiktok.com/oembed?url=${enc}`;
    case "twitter": return `https://publish.twitter.com/oembed?url=${enc}&omit_script=1`;
  }
}

type OEmbed = {
  title?: string;
  author_name?: string;
  provider_name?: string;
  thumbnail_url?: string;
  html?: string;
  duration?: number; // vimeo
};

async function fetchOEmbed(kind: NonNullable<VideoKind>, target: string): Promise<OEmbed | null> {
  try {
    const r = await fetch(oEmbedEndpoint(kind, target), {
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 (compatible; BrainInspirationBot/1.0)" },
    });
    if (!r.ok) return null;
    return (await r.json()) as OEmbed;
  } catch { return null; }
}

export const fetchLinkPreview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ url: z.string().url() }).parse(input)
  )
  .handler(async ({ data }) => {
    const kind = detectVideoKind(data.url);

    // For known web-video providers, prefer oEmbed (richer + reliable thumbnails)
    if (kind) {
      const [oe, htmlRes] = await Promise.all([
        fetchOEmbed(kind, data.url),
        fetch(data.url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; BrainInspirationBot/1.0)",
            Accept: "text/html,application/xhtml+xml",
          },
          redirect: "follow",
        }).catch(() => null),
      ]);

      let pageDescription = "";
      let pageTitleFallback = "";
      let ogImage = "";
      if (htmlRes && htmlRes.ok) {
        const html = await htmlRes.text();
        const meta = extractMeta(html);
        pageDescription = meta.description;
        pageTitleFallback = meta.title;
        ogImage = meta.image;
      }

      const title = oe?.title || pageTitleFallback || data.url;
      const author = oe?.author_name || "";
      const provider = oe?.provider_name || kind;
      let coverUrl = oe?.thumbnail_url || ogImage || "";
      if (coverUrl && !/^https?:\/\//i.test(coverUrl)) {
        try { coverUrl = new URL(coverUrl, data.url).toString(); } catch { coverUrl = ""; }
      }

      const userMsg = `Source: ${provider} video
URL: ${data.url}
Video title: ${title}
${author ? `Creator: ${author}` : ""}
${oe?.duration ? `Duration: ${oe.duration}s` : ""}

Page description / context:
${pageDescription || "(none)"}`;

      const formatted = await callAI(
        SYSTEM_BASE +
          `\nThe source is a ${provider} video the user wants to remember. You CANNOT see the video itself — work from title, creator, and description. ` +
          `In "body": (1) a short note on what this video is about based on the metadata, (2) a "## Why it caught my eye" section with a thoughtful guess at the hook based on the title/creator/description, (3) a "## Watch" section with a markdown link back to the source. Be honest where info is thin; don't invent specifics.`,
        userMsg
      );
      return { ...formatted, coverUrl, sourceUrl: data.url, pageTitle: title };
    }

    // Generic web link path
    const res = await fetch(data.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BrainInspirationBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`Couldn't fetch link [${res.status}]`);
    const html = await res.text();
    const meta = extractMeta(html);

    let coverUrl = meta.image;
    if (coverUrl && !/^https?:\/\//i.test(coverUrl)) {
      try { coverUrl = new URL(coverUrl, data.url).toString(); } catch { coverUrl = ""; }
    }

    const user = `Source URL: ${data.url}
Page title: ${meta.title}
Description: ${meta.description}

Page text (truncated):
${meta.body}`;
    const formatted = await callAI(
      SYSTEM_BASE + "\nThe source is a web link — preserve the original idea/argument; do not just summarize blandly.",
      user
    );
    return { ...formatted, coverUrl, sourceUrl: data.url, pageTitle: meta.title };
  });

// ──────────────────────────────────────────────────────────────────────────────
// IMAGE — Gemini vision describes + extracts text
// ──────────────────────────────────────────────────────────────────────────────
export const analyzeImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      imageDataUrl: z.string().min(20),
      capturedAt: z.string(),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY not configured");

    const res = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: SYSTEM_BASE + `\nThe source is an image. In "body", describe what's visually shown (composition, subject, mood), then add a section "## Captured text" with any text legible in the image (OCR). If no text, omit that section.`,
          },
          {
            role: "user",
            content: [
              { type: "text", text: `Captured at: ${data.capturedAt}\nDescribe this inspiration image and extract any visible text.` },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "inspiration",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                subject: { type: "string" },
                summary: { type: "string" },
                body: { type: "string" },
                tags: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 8 },
              },
              required: ["title", "subject", "summary", "body", "tags"],
            },
          },
        },
      }),
    });
    if (res.status === 429) throw new Error("Rate limited — try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted.");
    if (!res.ok) throw new Error(`Image analysis failed [${res.status}]: ${await res.text()}`);
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    return JSON.parse(content) as Formatted;
  });

// ──────────────────────────────────────────────────────────────────────────────
// SAVE — unified inspiration save (any source)
// ──────────────────────────────────────────────────────────────────────────────
export const saveInspiration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      title: z.string(),
      subject: z.string().optional(),
      summary: z.string().optional(),
      body: z.string(),
      tags: z.array(z.string()),
      source: z.enum(["voice", "typed", "text", "link", "image", "video"]),
      sourceUrl: z.string().optional(),
      mediaPath: z.string().optional(),
      coverImagePath: z.string().optional(),
      coverImageUrl: z.string().optional(),
      coverWidth: z.number().optional(),
      coverHeight: z.number().optional(),
      extractedText: z.string().optional(),
      rawTranscript: z.string().optional(),
      audioDurationS: z.number().optional(),
      capturedAt: z.string(),
    }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("notes")
      .insert({
        user_id: context.userId,
        title: data.title,
        subject: data.subject ?? null,
        summary: data.summary ?? null,
        body: data.body,
        tags: data.tags,
        source: data.source,
        source_url: data.sourceUrl ?? null,
        media_path: data.mediaPath ?? null,
        cover_image_path: data.coverImagePath ?? null,
        cover_image_url: data.coverImageUrl ?? null,
        cover_width: data.coverWidth ?? null,
        cover_height: data.coverHeight ?? null,
        extracted_text: data.extractedText ?? null,
        raw_transcript: data.rawTranscript ?? null,
        audio_duration_s: data.audioDurationS ?? null,
        captured_at: data.capturedAt,
        status: "draft",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

// ──────────────────────────────────────────────────────────────────────────────
// LIBRARY — list user's inspirations
// ──────────────────────────────────────────────────────────────────────────────
export const listInspirations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("notes")
      .select("id,title,subject,summary,tags,source,source_url,cover_image_url,cover_width,cover_height,status,notion_page_url,captured_at")
      .order("captured_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { items: data ?? [] };
  });

// ──────────────────────────────────────────────────────────────────────────────
// SIGNED URL — get long-lived signed URL for a media object
// ──────────────────────────────────────────────────────────────────────────────
export const getSignedMediaUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ path: z.string().min(1) }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { data: signed, error } = await context.supabase
      .storage
      .from("inspiration-media")
      .createSignedUrl(data.path, 60 * 60 * 24 * 365); // 1 year
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });
