import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { formatText, saveInspiration } from "@/lib/inspiration.functions";
import { Processing } from "../processing";

export function TextCapture() {
  const navigate = useNavigate();
  const format = useServerFn(formatText);
  const save = useServerFn(saveInspiration);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("");

  async function submit() {
    if (!text.trim()) return;
    setBusy(true);
    const capturedAt = new Date().toISOString();
    try {
      setStep("Formatting…");
      const f = await format({ data: { text, capturedAt } });
      setStep("Saving…");
      const { id } = await save({
        data: { ...f, source: "text", rawTranscript: text, capturedAt },
      });
      navigate({ to: "/review/$draftId", params: { draftId: id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
      setBusy(false);
    }
  }

  if (busy) return <Processing step={step} />;

  return (
    <div className="space-y-4 py-2">
      <h2 className="font-serif-pro text-3xl italic text-foreground">Capture a thought</h2>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={9}
        placeholder="Paste an idea, quote, snippet, or anything that struck you…"
        className="w-full rounded-xl border border-hairline bg-paper/60 p-4 text-[15px] text-foreground placeholder:text-ink-soft/60 focus:border-clay focus:outline-none"
      />
      <button
        onClick={submit}
        disabled={!text.trim()}
        className="group inline-flex h-11 w-full items-center justify-center rounded-md bg-gradient-warm px-5 text-sm font-medium text-accent-foreground disabled:opacity-50"
      >
        Format & save
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
