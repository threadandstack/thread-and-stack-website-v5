import { Loader2 } from "lucide-react";

export function Processing({ step }: { step: string }) {
  return (
    <div className="fade-up flex flex-col items-center gap-5 py-16 text-center">
      <Loader2 className="h-9 w-9 animate-spin text-clay" />
      <div className="font-serif-pro text-2xl italic text-gradient-warm">{step}</div>
      <p className="text-xs text-ink-soft">Hang tight — this takes a few seconds.</p>
    </div>
  );
}
