import { useState } from "react";
import { Mic, Link2, ImageIcon, Type } from "lucide-react";
import { VoiceCapture } from "./modes/VoiceCapture";
import { LinkCapture } from "./modes/LinkCapture";
import { TextCapture } from "./modes/TextCapture";
import { ImageCapture } from "./modes/ImageCapture";

type Mode = "voice" | "link" | "image" | "text";

const MODES: { id: Mode; label: string; Icon: typeof Mic }[] = [
  { id: "voice", label: "Voice", Icon: Mic },
  { id: "link", label: "Link", Icon: Link2 },
  { id: "image", label: "Image", Icon: ImageIcon },
  { id: "text", label: "Text", Icon: Type },
];

export function CaptureHub() {
  const [mode, setMode] = useState<Mode>("voice");

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] w-full flex-col">
      <div className="flex flex-1 items-center justify-center px-5 pb-32 pt-6">
        <div key={mode} className="fade-up w-full max-w-lg">
          {mode === "voice" && <VoiceCapture />}
          {mode === "link" && <LinkCapture />}
          {mode === "image" && <ImageCapture />}
          {mode === "text" && <TextCapture />}
        </div>
      </div>

      {/* Bottom mode picker — mobile native feel */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-background/85 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"
        aria-label="Source type"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {MODES.map(({ id, label, Icon }) => {
            const active = mode === id;
            return (
              <button
                key={id}
                onClick={() => setMode(id)}
                aria-pressed={active}
                className={`group flex flex-col items-center gap-1 rounded-xl py-2 transition-all ${
                  active ? "text-foreground" : "text-ink-soft hover:text-foreground"
                }`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full transition-all ${
                    active
                      ? "bg-gradient-warm text-accent-foreground shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)]"
                      : "bg-paper/40 group-hover:bg-paper"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[10px] uppercase tracking-wider">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
