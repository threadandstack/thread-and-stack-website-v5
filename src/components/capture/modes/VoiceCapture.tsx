import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { transcribeAudio } from "@/lib/notes.functions";
import { formatText, saveInspiration } from "@/lib/inspiration.functions";
import { Processing } from "../processing";

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function VoiceCapture() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"idle" | "recording" | "processing">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0);
  const [step, setStep] = useState("");

  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const capturedAtRef = useRef<string>("");

  const transcribe = useServerFn(transcribeAudio);
  const format = useServerFn(formatText);
  const save = useServerFn(saveInspiration);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    if (phase !== "recording") return;
    const id = setInterval(() => setElapsed((Date.now() - startedAtRef.current) / 1000), 100);
    return () => clearInterval(id);
  }, [phase]);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      capturedAtRef.current = new Date().toISOString();

      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => void handleStop();
      rec.start();
      recRef.current = rec;
      startedAtRef.current = Date.now();
      setElapsed(0);
      setPhase("recording");

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        setLevel(Math.min(1, Math.sqrt(sum / buf.length) * 3));
        animRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      toast.error("Microphone access denied");
      console.error(err);
    }
  }

  function stop() {
    recRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (animRef.current) cancelAnimationFrame(animRef.current);
    audioCtxRef.current?.close();
    setLevel(0);
    setPhase("processing");
  }

  async function handleStop() {
    try {
      const duration = (Date.now() - startedAtRef.current) / 1000;
      const blob = new Blob(chunksRef.current, { type: recRef.current?.mimeType ?? "audio/webm" });
      setStep("Transcribing…");
      const base64 = await blobToBase64(blob);
      const { text } = await transcribe({ data: { audioBase64: base64, mimeType: blob.type } });
      if (!text.trim()) throw new Error("Nothing heard. Try again closer to the mic.");

      setStep("Formatting…");
      const f = await format({ data: { text, capturedAt: capturedAtRef.current } });

      setStep("Saving…");
      const { id } = await save({
        data: {
          ...f,
          source: "voice",
          rawTranscript: text,
          audioDurationS: duration,
          capturedAt: capturedAtRef.current,
        },
      });
      navigate({ to: "/review/$draftId", params: { draftId: id } });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something broke");
      setPhase("idle");
    }
  }

  if (phase === "processing") return <Processing step={step} />;

  const recording = phase === "recording";
  const ringScale = 1 + level * 0.4;

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="text-center">
        <div className="font-serif-pro text-[72px] leading-none tracking-tight tabular-nums text-foreground md:text-[96px]">
          {fmtTime(elapsed)}
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-ink-soft">
          {recording ? "listening" : "tap to record"}
        </p>
      </div>

      <div className="relative">
        <div
          className="absolute inset-0 rounded-full bg-gradient-warm opacity-50 blur-2xl transition-transform duration-150"
          style={{ transform: `scale(${recording ? ringScale * 1.2 : 1})` }}
        />
        {recording && (
          <div className="absolute inset-0 animate-record-pulse rounded-full bg-gradient-warm opacity-40 blur-xl" />
        )}
        <button
          onClick={recording ? stop : start}
          aria-label={recording ? "Stop recording" : "Start recording"}
          className="relative grid h-28 w-28 place-items-center rounded-full bg-gradient-warm text-accent-foreground shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] transition-transform active:scale-95"
          style={{ transform: recording ? `scale(${ringScale})` : "scale(1)" }}
        >
          {recording ? <Square className="h-9 w-9 fill-current" /> : <Mic className="h-10 w-10" />}
        </button>
      </div>
    </div>
  );
}
