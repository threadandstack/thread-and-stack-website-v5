import { useState } from "react";
import { Compass, Linkedin, ArrowRight, Send } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WhiteLogo from "@/assets/logos/White_TS_Stacked.svg";
import avatarPhoto from "@/assets/brendan-avatar.webp";
import templatePreview from "@/assets/hackathon-template-preview.webp";

const TEMPLATE_URL = "https://threadandstack.notion.site/c4a1f21560aa42c686c284a4a322f574?v=2329819a37fc4a16b799b32cdfcb7113";

const NotionDevotionBrightonPage = () => {
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
        source: "notion-devotion-brighton",
        want_future_templates: wantTemplates,
        want_community: wantCommunity,
      });
      if (dbError) throw dbError;

      const interests: string[] = [];
      if (wantTemplates) interests.push("future_templates");
      if (wantCommunity) interests.push("notion_community");

      supabase.functions.invoke("sync-lead-to-notion", {
        body: {
          email,
          name: "",
          message: `Notion Devotion Brighton template request. Interests: ${interests.length ? interests.join(", ") : "template only"}`,
          source: "notion-devotion-brighton",
        },
      }).catch(() => {});

      setSubmitted(true);
      toast({
        title: "You're in! 🚀",
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
    <div className="dark min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:py-20 space-y-8 sm:space-y-10">
        {/* Avatar + Logo */}
        <div className="flex items-center gap-4">
          <img src={avatarPhoto} alt="Brendan" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-border" />
          <img src={WhiteLogo} alt="Thread & Stack" className="h-12 sm:h-14 opacity-80" />
        </div>

        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-sans text-muted-foreground uppercase tracking-widest">
            Notion Devotion Brighton · 2026
          </p>
          <h1 className="font-serif-pro text-3xl sm:text-4xl md:text-5xl font-semibold italic leading-tight">
            Happy building! 🚀
          </h1>
        </div>

        <div className="font-sans text-[15px] sm:text-base md:text-lg text-muted-foreground leading-relaxed">
          <p>
            Thanks so much for attending{" "}
            <span className="text-foreground font-medium">Notion Devotion Brighton</span>.
            It's genuinely brilliant to be here with you all — so many awesome builders and makers in one room. Grab the template below and get started.
          </p>
        </div>

        {/* Email capture card */}
        <div className="rounded-xl border bg-card p-4 sm:p-6 space-y-4 sm:space-y-5">
          <h2 className="font-serif-pro text-lg sm:text-xl font-semibold italic">
            Agent Knowledge Library Template
          </h2>
          <img src={templatePreview} alt="Agent Knowledge Library preview" className="w-full rounded-lg border border-border" />
          <p className="text-[13px] sm:text-sm text-muted-foreground font-sans leading-relaxed">
            Enter your email to unlock the template. I'm planning to share more templates, agent prompts, and build a Notion community — tick the boxes if you're interested, or just grab the template.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 relative">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-background border-border h-12 sm:h-10 text-base sm:text-sm"
                />
                <PillButton type="submit" disabled={isSubmitting} icon={Send} className="w-full sm:w-auto h-12 sm:h-10 bg-[hsl(330,85%,55%)] hover:bg-[hsl(330,85%,48%)] text-white">
                  {isSubmitting ? "Unlocking..." : "Get the template"}
                </PillButton>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="devotion-templates"
                    checked={wantTemplates}
                    onCheckedChange={(c) => setWantTemplates(c === true)}
                    className="mt-0.5 h-5 w-5 sm:h-4 sm:w-4"
                  />
                  <Label
                    htmlFor="devotion-templates"
                    className="text-[13px] sm:text-sm text-muted-foreground cursor-pointer leading-snug"
                  >
                    I'm planning on sharing more templates in the future — tick this if you'd like to hear from me
                  </Label>
                </div>

                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="devotion-community"
                    checked={wantCommunity}
                    onCheckedChange={(c) => setWantCommunity(c === true)}
                    className="mt-0.5 h-5 w-5 sm:h-4 sm:w-4"
                  />
                  <Label
                    htmlFor="devotion-community"
                    className="text-[13px] sm:text-sm text-muted-foreground cursor-pointer leading-snug"
                  >
                    I'm exploring building a community of Notion builders — I'd love to be part of it
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
            <div className="space-y-4 text-center py-2">
              <div className="text-4xl">🎉</div>
              <h3 className="font-serif-pro text-xl sm:text-2xl font-semibold italic text-foreground">
                You're all set!
              </h3>
              <p className="text-sm text-muted-foreground font-sans">
                Here's your template — duplicate it into your workspace and start building.
              </p>
              <PillButton asChild icon={ArrowRight} className="w-full sm:w-auto text-base h-12 bg-[hsl(330,85%,55%)] hover:bg-[hsl(330,85%,48%)] text-white">
                <a href={TEMPLATE_URL} target="_blank" rel="noopener noreferrer">
                  Duplicate Template
                </a>
              </PillButton>
            </div>
          )}
        </div>

        {/* Stay connected */}
        <div className="border-t border-border pt-6 sm:pt-8 space-y-4 sm:space-y-5">
          <h2 className="font-serif-pro text-xl sm:text-2xl font-semibold italic">Let's stay connected</h2>
          <p className="font-sans text-sm sm:text-base text-muted-foreground">
            I'd love to connect — whether it's about Notion services, building custom agents, or any other workspace challenge. Let's chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <PillButton variant="indigo" icon={Linkedin} asChild className="w-full sm:w-auto">
              <a
                href="https://www.linkedin.com/in/rodgersbrendan/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
            </PillButton>
            <PillButton variant="outline" icon={Compass} asChild className="w-full sm:w-auto">
              <a href="/notion-systems">Notion Services</a>
            </PillButton>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotionDevotionBrightonPage;
