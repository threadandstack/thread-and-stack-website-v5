import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, X, Send, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { getDraft, updateDraft, deleteDraft, syncDraftToNotion } from "@/lib/review.functions";

export const Route = createFileRoute("/_authenticated/review/$draftId")({
  component: Review,
});

function Review() {
  const { draftId } = Route.useParams();
  const navigate = useNavigate();
  const fetchDraft = useServerFn(getDraft);
  const update = useServerFn(updateDraft);
  const remove = useServerFn(deleteDraft);
  const sync = useServerFn(syncDraftToNotion);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchDraft({ data: { id: draftId } })
      .then((d: { title: string; subject: string | null; summary: string | null; body: string | null; tags: string[] }) => {
        setTitle(d.title);
        setSubject(d.subject ?? "");
        setSummary(d.summary ?? "");
        setBody(d.body ?? "");
        setTags(d.tags);
      })
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [draftId, fetchDraft]);

  // Autosave debounce
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(async () => {
      setSaving(true);
      try {
        await update({ data: { id: draftId, title, subject, summary, body, tags } });
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    }, 800);
    return () => clearTimeout(t);
  }, [title, subject, summary, body, tags, draftId, loading, update]);

  async function send() {
    setSyncing(true);
    try {
      const { url } = await sync({ data: { id: draftId } });
      toast.success("Sent to Notion", { description: url ? "Tap to open" : undefined, action: url ? { label: "Open", onClick: () => window.open(url, "_blank") } : undefined });
      navigate({ to: "/library" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Notion sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function discard() {
    if (!confirm("Discard this note?")) return;
    await remove({ data: { id: draftId } });
    navigate({ to: "/capture" });
  }

  function addTag() {
    const t = newTag.trim().toLowerCase();
    if (!t || tags.includes(t)) { setNewTag(""); return; }
    setTags([...tags, t]);
    setNewTag("");
  }

  if (loading) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-clay" />
      </div>
    );
  }

  return (
    <main className="relative min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-background/80 px-6 py-4 backdrop-blur">
        <Link to="/capture" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Capture
        </Link>
        <span className="text-[11px] uppercase tracking-wider text-ink-soft">
          {saving ? "saving…" : "review"}
        </span>
        <button onClick={discard} className="text-sm text-ink-soft hover:text-crimson" aria-label="Discard">
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8 pb-32">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-serif-pro w-full bg-transparent text-4xl italic leading-tight text-foreground focus:outline-none md:text-5xl"
          placeholder="Untitled"
        />

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="subject"
            className="rounded-full border border-clay/40 bg-clay/10 px-3 py-1 text-xs font-medium text-clay focus:outline-none"
            style={{ width: `${Math.max(80, subject.length * 8 + 30)}px` }}
          />
          {tags.map((t, i) => (
            <button
              key={i}
              onClick={() => setTags(tags.filter((_, j) => j !== i))}
              className="group inline-flex items-center gap-1 rounded-full border border-violet/40 bg-violet/10 px-3 py-1 text-xs text-violet hover:border-crimson hover:text-crimson"
            >
              {t}
              <X className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
          <div className="inline-flex items-center gap-1">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="add tag"
              className="w-20 rounded-full border border-dashed border-hairline bg-transparent px-3 py-1 text-xs text-ink-soft focus:border-clay focus:outline-none"
            />
            {newTag && (
              <button onClick={addTag} className="rounded-full p-1 text-clay">
                <Plus className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {summary && (
          <p className="mt-6 border-l-2 border-clay pl-4 text-[15px] italic text-ink-soft">
            {summary}
          </p>
        )}

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={Math.max(8, body.split("\n").length + 2)}
          className="mt-6 w-full resize-none bg-transparent text-[16px] leading-relaxed text-foreground focus:outline-none"
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-hairline bg-background/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <button
            onClick={discard}
            className="rounded-md border border-hairline px-4 py-2 text-sm text-ink-soft hover:bg-paper hover:text-foreground"
          >
            Discard
          </button>
          <button
            onClick={send}
            disabled={syncing}
            className="group inline-flex h-11 flex-1 items-center justify-center rounded-md bg-gradient-warm px-5 text-sm font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-px disabled:opacity-60"
          >
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send to Notion
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
