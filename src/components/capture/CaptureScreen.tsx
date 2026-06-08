import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mic, Square, Loader2, Keyboard, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { transcribeAudio, formatNote, saveNote } from "@/lib/notes.functions";

type Phase = "idle" | "recording" | "processing" | "typed";

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

export function CaptureScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [processStep, setProcessStep] = useState("");

  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const capturedAtRef = useRef<string>("");

  const transcribe = useServerFn(transcribeAudio);
  const format = useServerFn(formatNote);
  const save = useServerFn(saveNote);

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

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;
      capturedAtRef.current = new Date().toISOString();

      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => void handleStop();
      rec.start();
      recRef.current = rec;
      startedAtRef.current = Date.now();
      setElapsed(0);
      setPhase("recording");

      // Waveform
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

  function stopRecording() {
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
      setProcessStep("Transcribing…");
      const base64 = await blobToBase64(blob);
      const { text } = await transcribe({ data: { audioBase64: base64, mimeType: blob.type } });
      if (!text.trim()) throw new Error("Nothing heard. Try again closer to the mic.");

      setProcessStep("Formatting…");
      const formatted = await format({ data: { transcript: text, capturedAt: capturedAtRef.current } });

      setProcessStep("Saving…");
      const { id } = await save({
        data: {
          title: formatted.title,
          subject: formatted.subject,
          summary: formatted.summary,
          body: formatted.body,
          tags: formatted.tags,
          rawTranscript: text,
          source: "voice",
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

  async function submitTyped() {
    if (!typedText.trim()) return;
    setPhase("processing");
    capturedAtRef.current = new Date().toISOString();
    try {
      setProcessStep("Formatting…");
      const formatted = await format({ data: { transcript: typedText, capturedAt: capturedAtRef.current } });
      setProcessStep("Saving…");
      const { id } = await save({
        data: {
          title: formatted.title,
          subject: formatted.subject,
          summary: formatted.summary,
          body: formatted.body,
          tags: formatted.tags,
          rawTranscript: typedText,
          source: "typed",
          capturedAt: capturedAtRef.current,
        },
      });
      navigate({ to: "/review/$draftId", params: { draftId: id } });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something broke");
      setPhase("typed");
    }
  }

  if (phase === "processing") {
    return (
      <div className="fade-up flex flex-col items-center gap-6">
        <Loader2 className="h-10 w-10 animate-spin text-clay" />
        <div className="font-serif-pro text-3xl italic text-gradient-warm">{processStep}</div>
        <p className="text-sm text-ink-soft">Hang tight — this takes a few seconds.</p>
      </div>
    );
  }

  if (phase === "typed") {
    return (
      <div className="fade-up w-full max-w-lg">
        <h2 className="font-serif-pro text-3xl italic text-foreground">Type a note</h2>
        <textarea
          autoFocus
          value={typedText}
          onChange={(e) => setTypedText(e.target.value)}
          rows={8}
          placeholder="What's on your mind?"
          className="mt-4 w-full rounded-xl border border-hairline bg-paper/60 p-4 text-[15px] text-foreground placeholder:text-ink-soft/60 focus:border-clay focus:outline-none"
        />
        <div className="mt-4 flex items-center justify-between">
          <button onClick={() => setPhase("idle")} className="text-sm text-ink-soft hover:text-foreground">
            ← back
          </button>
          <button
            onClick={submitTyped}
            disabled={!typedText.trim()}
            className="group inline-flex h-11 items-center rounded-md bg-gradient-warm px-5 text-sm font-medium text-accent-foreground disabled:opacity-50"
          >
            Format & save
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  const recording = phase === "recording";
  const ringScale = 1 + level * 0.4;

  return (
    <div className="fade-up flex flex-col items-center gap-10">
      <div className="text-center">
        <div className="font-serif-pro text-[88px] leading-none tracking-tight tabular-nums text-foreground md:text-[120px]">
          {fmtTime(elapsed)}
        </div>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-ink-soft">
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
          onClick={recording ? stopRecording : startRecording}
          aria-label={recording ? "Stop recording" : "Start recording"}
          className="relative grid h-32 w-32 place-items-center rounded-full bg-gradient-warm text-accent-foreground shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] transition-transform active:scale-95 md:h-40 md:w-40"
          style={{ transform: recording ? `scale(${ringScale})` : "scale(1)" }}
        >
          {recording ? <Square className="h-10 w-10 fill-current" /> : <Mic className="h-12 w-12" />}
        </button>
      </div>

      {!recording && (
        <button
          onClick={() => setPhase("typed")}
          className="inline-flex items-center gap-2 rounded-full border border-hairline bg-paper/40 px-4 py-2 text-xs text-ink-soft backdrop-blur hover:text-foreground"
        >
          <Keyboard className="h-3.5 w-3.5" />
          type instead
        </button>
      )}
    </div>
  );
}
