import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContactDrawer } from "@/components/ContactDrawer";
import { PillButton } from "@/components/ui/pill-button";
import { Check, Zap, Layers, Repeat, Rocket, MessageCircle } from "lucide-react";
import { Emphasis } from "@/components/Emphasis";
import notionAdmin from "@/assets/notion-certified-admin.png";
import notionAdvanced from "@/assets/notion-advanced.png";
import notionWorkflows from "@/assets/notion-workflows.png";
import notionEssentials from "@/assets/notion-essentials.png";
import notionHeroPhoto from "@/assets/notion-certified-hero.png";
import notionAmbassadorBlack from "@/assets/notion-ambassador-black.png";

const NotionSystemsPage = () => {
  const [contactOpen, setContactOpen] = useState(false);

  const badges = [
    { src: notionAdmin, alt: "Notion Certified Admin" },
    { src: notionAdvanced, alt: "Notion Academy Advanced" },
    { src: notionWorkflows, alt: "Notion Academy Workflows" },
    { src: notionEssentials, alt: "Notion Academy Essentials" },
  ];

  const tiers = [
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Rapid Intervention",
      title: "Notion Sense-check Session",
      tagline: "1 System · 1 Discussion · 1 Workflow fixed",
      description:
        "A single focused session to unblock a Notion problem, validate a workspace decision, or fix a broken workflow. No ongoing commitment required.",
      includes: [
        "60-minute deep-dive on one system or workflow",
        "Full recording, AI transcription & summary",
        "A clear action plan — exactly what to do next",
      ],
      cta: "Book a Session",
    },
    {
      icon: <Layers className="w-5 h-5" />,
      label: "Concentrated Project",
      title: "System Build Engagement",
      tagline: "Establish workflows, migrate your CRM, simplify marketing, solve blockers",
      description:
        "A scoped engagement to build or rebuild your Notion workspace. Whether it's migrating a CRM, designing a content pipeline, or untangling operational chaos — we scope it together and deliver with clear milestones.",
      includes: [
        "Workspace audit & workflow mapping",
        "Custom Notion system design & build",
        "CRM migration, marketing ops, or team workflows",
        "Documentation, training & handover",
      ],
      cta: "Discuss a Build",
    },
    {
      icon: <Repeat className="w-5 h-5" />,
      label: "Ongoing Partnership",
      title: "Fractional Ops & Automations Director",
      tagline: "Ongoing Notion and AI ops support with monthly system focuses",
      description:
        "Embedded operational support on a monthly retainer. I keep your Notion backbone healthy, build AI-enabled automations, and tackle a new system focus each month — so you can ship without the tab chaos.",
      includes: [
        "Monthly system focus & optimisation sprint",
        "Ongoing Notion administration & maintenance",
        "AI workflow design & automation support",
        "Slack access for ops questions & unblocking",
      ],
      cta: "Explore a Retainer",
    },
  ];

  return (
    <main className="min-h-screen relative">
      <Navigation />
      <ContactDrawer open={contactOpen} onOpenChange={setContactOpen} source="notion-systems" />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {badges.map((badge, i) => (
                  <img key={i} src={badge.src} alt={badge.alt} className="w-10 h-auto" />
                ))}
              </div>
              <img
                src={notionAmbassadorBlack}
                alt="Notion Official Ambassador"
                className="h-8 w-auto mb-8"
              />

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold italic leading-[1.1] mb-6">
                Notion &{" "}
                <span className="relative inline-block text-accent">
                  Systems
                  <Emphasis className="absolute -bottom-2 left-0 right-0" delay={0.3} />
                </span>{" "}
                Consultancy
              </h1>

              <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Solve workspace chaos, save time, cut the busywork, and make the most of AI & Custom Agents.
              </p>
            </div>

            <div className="relative hidden md:block">
              <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <img
                  src={notionHeroPhoto}
                  alt="Brendan — Notion Certified Admin with all four Notion Academy badges"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* First two tiers */}
      {tiers.slice(0, 2).map((tier, index) => (
        <section key={index} className="py-20 px-6 bg-card">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 text-accent">
                    {tier.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold italic">{tier.title}</h2>
                    <p className="text-sm font-sans text-accent">{tier.label}</p>
                  </div>
                </div>
                <p className="font-sans font-medium mb-3 text-foreground">{tier.tagline}</p>
                <p className="font-sans leading-relaxed mb-6 text-muted-foreground">{tier.description}</p>
                <PillButton icon={Rocket} onClick={() => setContactOpen(true)}>
                  {tier.cta}
                </PillButton>
              </div>
              <div>
                <h3 className="font-semibold font-sans mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {tier.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 mt-1 flex-shrink-0 text-accent" />
                      <span className="font-sans text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Fractional tier + CTA — indigo background */}
      <section className="pt-20 pb-24 px-6 bg-indigo text-indigo-foreground">
        <div className="max-w-5xl mx-auto">
          {/* Fractional content */}
          <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white">
                  {tiers[2].icon}
                </div>
                <div>
                  <h2 className="text-3xl font-semibold italic text-white">{tiers[2].title}</h2>
                  <p className="text-sm font-sans text-white/80">{tiers[2].label}</p>
                </div>
              </div>
              <p className="font-sans font-medium mb-3 text-white/90">{tiers[2].tagline}</p>
              <p className="font-sans leading-relaxed mb-6 text-white/80">{tiers[2].description}</p>
              <PillButton icon={Rocket} variant="white" onClick={() => setContactOpen(true)}>
                {tiers[2].cta}
              </PillButton>
            </div>
            <div>
              <h3 className="font-semibold font-sans mb-4 text-white">What's Included</h3>
              <ul className="space-y-3">
                {tiers[2].includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 mt-1 flex-shrink-0 text-white" />
                    <span className="font-sans text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Floating white CTA pill */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] p-10 md:p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold italic mb-4 text-foreground">
              Not sure which is right?
            </h2>
            <p className="font-sans text-muted-foreground text-lg mb-8">
              Start with a conversation. We'll figure out the right shape together.
            </p>
            <PillButton
              size="lg"
              icon={MessageCircle}
              onClick={() => setContactOpen(true)}
            >
              Start a Conversation
            </PillButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default NotionSystemsPage;
