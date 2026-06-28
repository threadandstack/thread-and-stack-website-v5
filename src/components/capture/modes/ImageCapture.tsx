import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { analyzeImage, saveInspiration, getSignedMediaUrl } from "@/lib/inspiration.functions";
import { Processing } from "../processing";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function imageSize(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => res({ w: 0, h: 0 });
    img.src = dataUrl;
  });
}

export function ImageCapture() {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeImage);
  const sign = useServerFn(getSignedMediaUrl);
  const save = useServerFn(saveInspiration);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("");

  async function pick(f: File) {
    if (!f.type.startsWith("image/")) {
      toast.error("That's not an image");
      return;
    }
    setFile(f);
    setPreview(await fileToDataUrl(f));
  }

  async function submit() {
    if (!file || !preview) return;
    setBusy(true);
    const capturedAt = new Date().toISOString();
    try {
      setStep("Looking at the image…");
      const f = await analyze({ data: { imageDataUrl: preview, capturedAt } });

      setStep("Uploading…");
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${u.user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("inspiration-media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;

      const { url } = await sign({ data: { path } });
      const dims = await imageSize(preview);

      setStep("Saving…");
      const { id } = await save({
        data: {
          ...f,
          source: "image",
          mediaPath: path,
          coverImagePath: path,
          coverImageUrl: url,
          coverWidth: dims.w,
          coverHeight: dims.h,
          capturedAt,
        },
      });
      navigate({ to: "/review/$draftId", params: { draftId: id } });
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed");
      setBusy(false);
    }
  }

  if (busy) return <Processing step={step} />;

  return (
    <div className="space-y-4 py-2">
      <h2 className="font-serif-pro text-3xl italic text-foreground">Capture an image</h2>

      {!preview ? (
        <button
          onClick={() => fileRef.current?.click()}
          className="grid h-56 w-full place-items-center rounded-xl border-2 border-dashed border-hairline bg-paper/30 text-ink-soft hover:border-clay hover:text-foreground"
        >
          <div className="flex flex-col items-center gap-3">
            <ImageIcon className="h-8 w-8" />
            <span className="text-sm">Tap to choose or take a photo</span>
          </div>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-hairline bg-paper/30">
          <img src={preview} alt="" className="max-h-72 w-full object-contain" />
          <button
            onClick={() => { setPreview(null); setFile(null); }}
            className="absolute right-2 top-2 rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur"
          >
            change
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
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
        Analyze & save
      </button>
    </div>
  );
}
