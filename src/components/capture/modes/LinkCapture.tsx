import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Link2, ArrowRight, Youtube, Play, Twitter } from "lucide-react";
import { toast } from "sonner";
import { fetchLinkPreview, saveInspiration } from "@/lib/inspiration.functions";
import { Processing } from "../processing";

type Hint = { label: string; Icon: typeof Link2 } | null;

function hintFor(url: string): Hint {
  let h = "";
  try { h = new URL(url).hostname.replace(/^www\./, ""); } catch { return null; }
  if (h === "youtube.com" || h === "m.youtube.com" || h === "youtu.be") return { label: "YouTube video", Icon: Youtube };
  if (h === "vimeo.com" || h.endsWith(".vimeo.com")) return { label: "Vimeo video", Icon: Play };
  if (h === "loom.com" || h.endsWith(".loom.com")) return { label: "Loom video", Icon: Play };
  if (h === "tiktok.com" || h.endsWith(".tiktok.com")) return { label: "TikTok video", Icon: Play };
  if (h === "twitter.com" || h === "x.com") return { label: "Post on X", Icon: Twitter };
  return null;
}

export function LinkCapture() {
  const navigate = useNavigate();
  const fetchLink = useServerFn(fetchLinkPreview);
  const save = useServerFn(saveInspiration);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("");

  const hint = hintFor(url.trim());

  async function submit() {
    if (!url.trim()) return;
    setBusy(true);
    const capturedAt = new Date().toISOString();
    try {
      setStep(hint ? `Reading ${hint.label}…` : "Fetching page…");
      const r = await fetchLink({ data: { url } });
      setStep("Saving…");
      const { id } = await save({
        data: {
          title: r.title,
          subject: r.subject,
          summary: r.summary,
          body: r.body,
          tags: r.tags,
          source: "link",
          sourceUrl: r.sourceUrl,
          coverImageUrl: r.coverUrl || undefined,
          capturedAt,
        },
      });
      navigate({ to: "/review/$draftId", params: { draftId: id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't read that link");
      setBusy(false);
    }
  }

  if (busy) return <Processing step={step} />;

  return (
    <div className="space-y-4 py-2">
      <h2 className="font-serif-pro text-3xl italic text-foreground">Save a link</h2>

      <div className="relative">
        <Link2 className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-ink-soft" />
        <input
          autoFocus
          type="url"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Paste any URL — article, YouTube, X post…"
          className="w-full rounded-xl border border-hairline bg-paper/60 py-3 pl-9 pr-3 text-[15px] text-foreground placeholder:text-ink-soft/60 focus:border-clay focus:outline-none"
        />
      </div>

      {hint && (
        <div className="flex items-center gap-2 rounded-lg border border-hairline/60 bg-paper/30 px-3 py-2 text-xs text-ink-soft">
          <hint.Icon className="h-3.5 w-3.5" />
          <span>Detected: <span className="text-foreground">{hint.label}</span></span>
        </div>
      )}

      <button
        onClick={submit}
        disabled={!url.trim()}
        className="group inline-flex h-11 w-full items-center justify-center rounded-md bg-gradient-warm px-5 text-sm font-medium text-accent-foreground disabled:opacity-50"
      >
        Fetch & format
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>

      <p className="text-center text-[11px] text-ink-soft">
        Articles get title + cover + key text. Videos (YouTube, Vimeo, Loom, TikTok) get title, creator & thumbnail.
      </p>
    </div>
  );
}
