import { Compass, Linkedin, ArrowRight } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { Footer } from "@/components/Footer";

const NotionHackathonLondonPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto px-6 py-24 space-y-10">
        <div className="space-y-2">
          <p className="text-sm font-sans text-muted-foreground uppercase tracking-widest">Notion Hackathon London · 2026</p>
          <h1 className="font-serif-pro text-4xl md:text-5xl font-semibold italic leading-tight">
            Thanks for being there ✨
          </h1>
        </div>

        <div className="space-y-5 font-sans text-base md:text-lg text-muted-foreground leading-relaxed">
          <p>
            Thanks so much for attending <span className="text-foreground font-medium">Notion Hackathon London</span>. I'm so excited to have shared space with so many awesome builders and makers — it was genuinely brilliant to meet you all.
          </p>
          <p>
            You can duplicate the <span className="text-foreground font-medium">Agent Knowledge Library</span> template below. Happy building! 🚀
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-3">
          <h2 className="font-serif-pro text-xl font-semibold italic">Agent Knowledge Library Template</h2>
          <p className="text-sm text-muted-foreground font-sans">
            Duplicate this template into your own Notion workspace to get started.
          </p>
          <PillButton asChild icon={ArrowRight}>
            <a href="https://www.notion.so/templates" target="_blank" rel="noopener noreferrer">
              Duplicate Template
            </a>
          </PillButton>
        </div>

        <div className="border-t pt-8 space-y-5">
          <h2 className="font-serif-pro text-2xl font-semibold italic">Let's stay connected</h2>
          <p className="font-sans text-muted-foreground">
            I'd love to connect — whether it's about Notion services, building custom agents, or any other workspace challenge. Let's chat.
          </p>
          <div className="flex flex-wrap gap-4">
            <PillButton variant="indigo" icon={Linkedin} asChild>
              <a href="https://www.linkedin.com/in/rodgersbrendan/" target="_blank" rel="noopener noreferrer">
                Connect on LinkedIn
              </a>
            </PillButton>
            <PillButton variant="outline" icon={Compass} asChild>
              <a href="/notion-systems">
                Notion Services
              </a>
            </PillButton>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotionHackathonLondonPage;
