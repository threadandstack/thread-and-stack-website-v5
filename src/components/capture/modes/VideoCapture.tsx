import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Video, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { transcribeAudio } from "@/lib/notes.functions";
import { analyzeImage, saveInspiration, getSignedMediaUrl } from "@/lib/inspiration.functions";
import { Processing } from "../processing";

const MAX_DURATION_S = 180; // 3 min cap

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      const result = r.result as string;
      res(result.split(",")[1] ?? "");
    };
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

async function extractPosterFrame(file: File): Promise<{ dataUrl: string; w: number; h: number; durationS: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      const seek = Math.min(1, video.duration * 0.25);
      video.currentTime = seek;
    };
    video.onseeked = () => {
      const c = document.createElement("canvas");
      c.width = video.videoWidth;
      c.height = video.videoHeight;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(video, 0, 0);
      resolve({
        dataUrl: c.toDataURL("image/jpeg", 0.82),
        w: video.videoWidth,
        h: video.videoHeight,
        durationS: video.duration,
      });
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => reject(new Error("Couldn't read video"));
  });
}

export function VideoCapture() {
  const navigate = useNavigate();
  const transcribe = useServerFn(transcribeAudio);
  const analyze = useServerFn(analyzeImage);
  const sign = useServerFn(getSignedMediaUrl);
  const save = useServerFn(saveInspiration);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [poster, setPoster] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("");

  async function pick(f: File) {
    if (!f.type.startsWith("video/")) { toast.error("That's not a video"); return; }
    if (f.size > 100 * 1024 * 1024) { toast.error("Max 100MB"); return; }
    try {
      const { dataUrl, durationS } = await extractPosterFrame(f);
      if (durationS > MAX_DURATION_S) {
        toast.error(`Max ${MAX_DURATION_S}s — try a shorter clip`);
        return;
      }
      setFile(f);
      setPoster(dataUrl);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't read video");
    }
  }

  async function submit() {
    if (!file || !poster) return;
    setBusy(true);
    const capturedAt = new Date().toISOString();
    try {
      setStep("Looking at the frame…");
      const frame = await analyze({ data: { imageDataUrl: poster, capturedAt } });

      setStep("Transcribing audio…");
      const base64 = await fileToBase64(file);
      let transcript = "";
      try {
        const t = await transcribe({ data: { audioBase64: base64, mimeType: file.type } });
        transcript = t.text;
      } catch (e) {
        console.warn("Transcription failed; continuing with frame-only", e);
      }

      setStep("Uploading…");
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const ext = file.name.split(".").pop() || "mp4";
      const id = crypto.randomUUID();
      const videoPath = `${u.user.id}/${id}.${ext}`;
      const posterPath = `${u.user.id}/${id}-poster.jpg`;

      const { error: vErr } = await supabase.storage
        .from("inspiration-media")
        .upload(videoPath, file, { contentType: file.type });
      if (vErr) throw vErr;

      // Upload poster
      const posterBlob = await (await fetch(poster)).blob();
      await supabase.storage
        .from("inspiration-media")
        .upload(posterPath, posterBlob, { contentType: "image/jpeg" });

      const { url: posterUrl } = await sign({ data: { path: posterPath } });

      setStep("Saving…");
      // Merge transcript into body if we got one
      const body = transcript
        ? `${frame.body}\n\n## What's said\n${transcript}`
        : frame.body;

      const { id: noteId } = await save({
        data: {
          title: frame.title,
          subject: frame.subject,
          summary: frame.summary,
          body,
          tags: frame.tags,
          source: "video",
          mediaPath: videoPath,
          coverImagePath: posterPath,
          coverImageUrl: posterUrl,
          rawTranscript: transcript || undefined,
          capturedAt,
        },
      });
      navigate({ to: "/review/$draftId", params: { draftId: noteId } });
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed");
      setBusy(false);
    }
  }

  if (busy) return <Processing step={step} />;

  return (
    <div className="space-y-4 py-2">
      <h2 className="font-serif-pro text-3xl italic text-foreground">Capture a video</h2>

      {!poster ? (
        <button
          onClick={() => fileRef.current?.click()}
          className="grid h-56 w-full place-items-center rounded-xl border-2 border-dashed border-hairline bg-paper/30 text-ink-soft hover:border-clay hover:text-foreground"
        >
          <div className="flex flex-col items-center gap-3">
            <Video className="h-8 w-8" />
            <span className="text-sm">Tap to choose or record a video</span>
            <span className="text-[10px] text-ink-soft">up to {MAX_DURATION_S / 60} min</span>
          </div>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-hairline bg-paper/30">
          <img src={poster} alt="" className="max-h-72 w-full object-contain" />
          <button
            onClick={() => { setPoster(null); setFile(null); }}
            className="absolute right-2 top-2 rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur"
          >
            change
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) void pick(f); }}
      />

      <button
        onClick={submit}
        disabled={!file}
        className="group inline-flex h-11 w-full items-center justify-center rounded-md bg-gradient-warm px-5 text-sm font-medium text-accent-foreground disabled:opacity-50"
      >
        <Upload className="mr-2 h-4 w-4" />
        Process & save
      </button>
    </div>
  );
}
