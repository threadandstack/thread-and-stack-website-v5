import { useState } from "react";
import { Compass, Linkedin, ArrowRight, Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import avatarPhoto from "@/assets/brendan-avatar.webp";
import templatePreview from "@/assets/hackathon-template-preview.webp";

const TEMPLATE_URL =
  "https://threadandstack.notion.site/c4a1f21560aa42c686c284a4a322f574?v=2329819a37fc4a16b799b32cdfcb7113";

const NotionHackathonLondonV2Page = () => {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [wantTemplates, setWantTemplates] = useState(false);
  const [wantCommunity, setWantCommunity] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    setIsSubmitting(true);
    try {
      const { error: dbError } = await supabase.from("hackathon_leads").insert({
        email,
        source: "notion-hackathon-london-v2",
        want_future_templates: wantTemplates,
        want_community: wantCommunity,
      });
      if (dbError) throw dbError;

      const interests: string[] = [];
      if (wantTemplates) interests.push("future_templates");
      if (wantCommunity) interests.push("notion_community");

      supabase.functions
        .invoke("sync-lead-to-notion", {
          body: {
            email,
            name: "",
            message: `Hackathon template request. Interests: ${
              interests.length ? interests.join(", ") : "template only"
            }`,
            source: "notion-hackathon-london-v2",
          },
        })
        .catch(() => {});

      setSubmitted(true);
      toast({
        title: "You're in 🚀",
        description: "Grab your template below.",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme="light">
      <Navigation variant="default" hideLogo />

      <main className="relative">
        <section className="relative mx-auto max-w-3xl px-6 pt-20 pb-12 md:pt-28">
          {/* Avatar */}
          <div className="mb-10 flex items-center gap-4">
            <img
              src={avatarPhoto}
              alt="Brendan"
              className="h-14 w-14 rounded-full border border-hairline object-cover shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:h-16 sm:w-16"
            />
            <div>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Notion Hackathon London · 2026
              </span>
              <span className="mt-1 block text-[13px] text-foreground/70">
                A note from Brendan
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-serif-pro italic font-normal text-balance text-5xl leading-[1.02] tracking-[-0.02em] md:text-[68px]">
            Happy <span className="text-clay">building.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-[16.5px] leading-relaxed text-ink-soft">
            Thanks so much for spending the day at{" "}
            <span className="text-foreground">Notion Hackathon London</span>. So
            many brilliant builders and makers in one room — it's genuinely a
            treat. Grab the template below and get cracking.
          </p>

          <span
            aria-hidden
            className="mt-12 block h-px w-16"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(var(--clay) / 0.55), transparent)",
            }}
          />
        </section>

        {/* Template card */}
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <div className="rounded-2xl border border-hairline bg-background/70 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] backdrop-blur-sm md:p-9">
            <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              <Sparkles className="h-3.5 w-3.5 text-clay" />
              Free template
            </div>
            <h2 className="font-serif-pro italic font-normal text-3xl leading-tight tracking-[-0.02em] md:text-4xl">
              Agent Knowledge Library
            </h2>

            <div className="mt-6 overflow-hidden rounded-xl border border-hairline">
              <img
                src={templatePreview}
                alt="Agent Knowledge Library preview"
                className="block w-full"
              />
            </div>

            <p className="mt-6 text-[14.5px] leading-relaxed text-ink-soft">
              Pop your email in to unlock the template. I'm planning to share
              more templates, agent prompts, and maybe build a small Notion
              community — tick a box if either sounds useful, or just grab the
              template and run.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="relative mt-6 space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 flex-1 rounded-md border-hairline bg-background text-[15px]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px disabled:opacity-60"
                    style={{
                      backgroundImage:
                        "linear-gradient(95deg, var(--gradient-3color))",
                    }}
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Unlocking..." : "Get the template"}
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="hack-templates-v2"
                      checked={wantTemplates}
                      onCheckedChange={(c) => setWantTemplates(c === true)}
                      className="mt-0.5 h-4 w-4"
                    />
                    <Label
                      htmlFor="hack-templates-v2"
                      className="cursor-pointer text-[13.5px] leading-snug text-ink-soft"
                    >
                      I'd like to hear about future templates and agent prompts.
                    </Label>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="hack-community-v2"
                      checked={wantCommunity}
                      onCheckedChange={(c) => setWantCommunity(c === true)}
                      className="mt-0.5 h-4 w-4"
                    />
                    <Label
                      htmlFor="hack-community-v2"
                      className="cursor-pointer text-[13.5px] leading-snug text-ink-soft"
                    >
                      I'd love to be part of a small community of Notion builders.
                    </Label>
                  </div>
                </div>

                {/* Honeypot */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <Input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-4 rounded-xl border border-hairline bg-paper/60 p-6 text-center">
                <div className="text-3xl">🎉</div>
                <h3 className="font-serif-pro italic text-2xl font-normal">
                  You're all set.
                </h3>
                <p className="text-[14px] text-ink-soft">
                  Duplicate the template into your workspace and start building.
                </p>
                <a
                  href={TEMPLATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px"
                  style={{
                    backgroundImage:
                      "linear-gradient(95deg, var(--gradient-3color))",
                  }}
                >
                  Duplicate template
                  <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1">
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Stay connected */}
        <section className="mx-auto max-w-3xl px-6 pb-24">
          <div className="rounded-2xl border border-hairline bg-background/60 p-6 md:p-9">
            <span className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Stay in touch
            </span>
            <h2 className="font-serif-pro italic font-normal text-3xl leading-tight tracking-[-0.02em] md:text-4xl">
              Let's <span className="text-clay">stay connected.</span>
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              Whether it's Notion services, custom agents, or any other
              workspace challenge — I'd love to chat.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://www.linkedin.com/in/rodgersbrendan/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px"
                style={{
                  backgroundImage:
                    "linear-gradient(95deg, var(--gradient-3color))",
                }}
              >
                <Linkedin className="h-4 w-4" />
                Connect on LinkedIn
              </a>
              <a
                href="/services"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-md border border-hairline bg-background px-6 text-[14.5px] font-medium text-foreground transition-colors hover:bg-paper"
              >
                <Compass className="h-4 w-4" />
                Notion services
                <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1">
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotionHackathonLondonV2Page;
