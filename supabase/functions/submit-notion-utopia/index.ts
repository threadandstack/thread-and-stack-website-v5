import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "npm:zod@3.25.76";

const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");
const NOTION_DATABASE_ID = "33e8863b87d480ff9487e4cd14ffe6e2";
const NOTION_DATA_SOURCE_ID = "33e8863b-87d4-800b-b9c1-000bf17489a6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const outcomeOptions = [
  "One place to see what’s due this week (across all projects)",
  "Simple task capture and prioritisation (low friction)",
  "Project tracking with clear phases and ownership",
  "Work with subcontractors/clients without paying for loads of seats",
  "Better meeting notes → actions → follow-up",
  "A lightweight CRM for clients and partners",
  "A hub for templates docs and “how we work”",
  "Voice-to-text workflows that actually stick",
  "AI that’s useful because knowledge is structured",
] as const;

const workStyleOptions = [
  "Mostly on mobile",
  "Mostly on laptop/desktop",
  "I work best from my calendar",
  "I do lots of voice notes / dictation",
  "I avoid admin time unless it’s dead simple",
  "I need a visual overview (boards/timelines)",
  "I need a tight list view (today/this week)",
] as const;

const currentToolOptions = [
  "Google Calendar",
  "Gmail",
  "Slack",
  "Zoom / Meet",
  "Asana",
  "ClickUp",
  "Trello",
  "Airtable",
  "Docs/Sheets/Drive",
  "Paper notebook / whiteboard",
  "Other",
] as const;

const activeProjectOptions = ["1–3", "4–7", "8–12", "13+"] as const;
const accessNeedsOptions = [
  "Just me",
  "Me + 1–2 collaborators",
  "Me + rotating subcontractors",
  "Me + clients + subcontractors",
] as const;
const voicePriorityOptions = ["Nice-to-have", "Important", "Critical (if it’s fiddly I won’t use it)"] as const;
const integrationOptions = [
  "Google Calendar",
  "Gmail",
  "Slack",
  "Zoom/Meet transcripts",
  "Drive files",
  "Proposal/invoicing tool",
  "None / happy to replace things",
  "Other",
] as const;

const optionalText = (max: number) => z.string().trim().max(max).default("");

const BodySchema = z
  .object({
    goals: z.string().trim().min(1).max(1200),
    outcomes: z.array(z.enum(outcomeOptions)).max(3).default([]),
    friction: optionalText(4000),
    noChangeCost: optionalText(4000),
    workStyle: z.array(z.enum(workStyleOptions)).default([]),
    currentTools: z.array(z.enum(currentToolOptions)).default([]),
    currentToolsOther: optionalText(500),
    activeProjects: z.union([z.enum(activeProjectOptions), z.literal("")]).default(""),
    accessNeeds: z.union([z.enum(accessNeedsOptions), z.literal("")]).default(""),
    voicePriority: z.union([z.enum(voicePriorityOptions), z.literal("")]).default(""),
    integrations: z.array(z.enum(integrationOptions)).default([]),
    integrationsOther: optionalText(500),
    eightWeekVision: optionalText(4000),
    concern: optionalText(4000),
    extraNotes: optionalText(4000),
  })
  .superRefine((value, ctx) => {
    if (value.currentTools.includes("Other") && !value.currentToolsOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "currentToolsOther is required when Other is selected",
        path: ["currentToolsOther"],
      });
    }

    if (value.integrations.includes("Other") && !value.integrationsOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "integrationsOther is required when Other is selected",
        path: ["integrationsOther"],
      });
    }
  });

type Body = z.infer<typeof BodySchema>;

const chunkText = (value: string, chunkSize = 1800) =>
  value
    .trim()
    .match(new RegExp(`.{1,${chunkSize}}`, "gs"))
    ?.filter(Boolean) ?? [];

const titleProperty = (value: string) => ({
  title: chunkText(value).map((content) => ({ text: { content } })),
});

const richTextProperty = (value: string) => ({
  rich_text: chunkText(value).map((content) => ({ text: { content } })),
});

const multiSelectProperty = (values: string[]) => ({
  multi_select: values.map((name) => ({ name })),
});

const selectProperty = (value: string) => ({
  select: { name: value },
});

const buildProperties = (body: Body) => {
  const properties: Record<string, unknown> = {
    "What are you hoping to get from Notion? (in your own words)": titleProperty(body.goals),
  };

  if (body.outcomes.length) {
    properties["Which outcomes matter most right now? (pick up to 3)"] = multiSelectProperty(body.outcomes);
  }

  if (body.friction) {
    properties["Where does your current setup create the most friction?"] = richTextProperty(body.friction);
  }

  if (body.noChangeCost) {
    properties["What happens if nothing changes?  "] = richTextProperty(body.noChangeCost);
  }

  if (body.workStyle.length) {
    properties["How do you actually like to work day-to-day?"] = multiSelectProperty(body.workStyle);
  }

  if (body.currentTools.length) {
    properties["What are you using today?"] = multiSelectProperty(body.currentTools);
  }

  if (body.currentToolsOther) {
    properties["Name the other important tools you are using"] = richTextProperty(body.currentToolsOther);
  }

  if (body.activeProjects) {
    properties["Roughly how many active projects are you juggling?"] = selectProperty(body.activeProjects);
  }

  if (body.accessNeeds) {
    properties["Who needs access to the system?"] = selectProperty(body.accessNeeds);
  }

  if (body.voicePriority) {
    properties["How important is voice-to-text for this to work?"] = selectProperty(body.voicePriority);
  }

  if (body.integrations.length) {
    properties["What must Notion play nicely with?"] = multiSelectProperty(body.integrations);
  }

  if (body.integrationsOther) {
    properties["What other tools?"] = richTextProperty(body.integrationsOther);
  }

  if (body.eightWeekVision) {
    properties["If this worked brilliantly what would be true 8 weeks from now?"] = richTextProperty(body.eightWeekVision);
  }

  if (body.concern) {
    properties["What’s your biggest concern about implementing Notion? (in your own words)"] = richTextProperty(body.concern);
  }

  if (body.extraNotes) {
    properties["Any other notes you want to add?"] = richTextProperty(body.extraNotes);
  }

  return properties;
};

const createNotionPage = async (parent: Record<string, string>, notionVersion: string, properties: Record<string, unknown>) => {
  return await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": notionVersion,
    },
    body: JSON.stringify({ parent, properties }),
  });
};

const readErrorBody = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return await response.text();
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!NOTION_API_KEY) {
    return new Response(JSON.stringify({ error: "NOTION_API_KEY is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    let payload: unknown;

    try {
      payload = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = BodySchema.safeParse(payload);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const properties = buildProperties(parsed.data);

    let response = await createNotionPage({ data_source_id: NOTION_DATA_SOURCE_ID }, "2025-09-03", properties);
    let primaryError: unknown = null;

    if (!response.ok) {
      primaryError = await readErrorBody(response);
      console.error("submit-notion-utopia data source create failed", primaryError);

      response = await createNotionPage({ database_id: NOTION_DATABASE_ID }, "2022-06-28", properties);
    }

    if (!response.ok) {
      const fallbackError = await readErrorBody(response);
      console.error("submit-notion-utopia database create failed", fallbackError);
      return new Response(
        JSON.stringify({ error: "Notion API error", details: { dataSource: primaryError, database: fallbackError } }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify({ success: true, notionPageId: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("submit-notion-utopia unexpected error", error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});