import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Link2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { fetchLinkPreview, saveInspiration } from "@/lib/inspiration.functions";
import { Processing } from "../processing";

export function LinkCapture() {
  const navigate = useNavigate();
  const fetchLink = useServerFn(fetchLinkPreview);
  const save = useServerFn(saveInspiration);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("");

  async function submit() {
    if (!url.trim()) return;
    setBusy(true);
    const capturedAt = new Date().toISOString();
    try {
      setStep("Fetching page…");
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
          placeholder="https://…"
          className="w-full rounded-xl border border-hairline bg-paper/60 py-3 pl-9 pr-3 text-[15px] text-foreground placeholder:text-ink-soft/60 focus:border-clay focus:outline-none"
        />
      </div>
      <button
        onClick={submit}
        disabled={!url.trim()}
        className="group inline-flex h-11 w-full items-center justify-center rounded-md bg-gradient-warm px-5 text-sm font-medium text-accent-foreground disabled:opacity-50"
      >
        Fetch & format
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
      <p className="text-center text-[11px] text-ink-soft">
        We'll grab the title, cover image, and key text — then format it.
      </p>
    </div>
  );
}
