import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Transcribe a base64 audio blob via ElevenLabs Scribe
export const transcribeAudio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      audioBase64: z.string().min(1),
      mimeType: z.string().min(1),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY not configured");

    const bytes = Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: data.mimeType });

    const form = new FormData();
    form.append("file", blob, "note.webm");
    form.append("model_id", "scribe_v2");
    form.append("tag_audio_events", "false");
    form.append("diarize", "false");

    const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: { "xi-api-key": apiKey },
      body: form,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Transcription failed [${res.status}]: ${err}`);
    }
    const json = await res.json() as { text?: string };
    return { text: json.text ?? "" };
  });

// Format a transcript into a structured note via Lovable AI
export const formatNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      transcript: z.string().min(1).max(50_000),
      capturedAt: z.string(),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY not configured");

    const system = `You format raw voice-note transcripts into clean structured notes.
- title: a punchy 3-8 word title that captures the essence
- subject: ONE short noun-phrase category (e.g. "product", "personal", "marketing", "engineering"). Reuse common categories when possible.
- summary: one tight sentence (max 160 chars)
- body: cleaned-up prose in markdown. Fix grammar and filler words but preserve meaning and voice. Use headings and bullets where natural.
- tags: 2-5 lowercase single-word tags (no hashtags)
Return ONLY valid JSON, no markdown fences.`;

    const user = `Captured at: ${data.capturedAt}\n\nTranscript:\n${data.transcript}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "note",
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
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Format failed [${res.status}]: ${err}`);
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from AI");
    const parsed = JSON.parse(content) as {
      title: string; subject: string; summary: string; body: string; tags: string[];
    };
    return parsed;
  });

// Save a draft note to the database
export const saveNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      title: z.string(),
      subject: z.string().optional(),
      summary: z.string().optional(),
      body: z.string(),
      tags: z.array(z.string()),
      rawTranscript: z.string().optional(),
      source: z.enum(["voice", "typed"]),
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
        raw_transcript: data.rawTranscript ?? null,
        source: data.source,
        audio_duration_s: data.audioDurationS ?? null,
        captured_at: data.capturedAt,
        status: "draft",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });
