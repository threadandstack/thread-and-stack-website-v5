import { useState, useEffect, useRef } from "react";
import { PillButton } from "@/components/ui/pill-button";
import { Palette, Cog, ArrowRight } from "lucide-react";
import { Emphasis } from "@/components/Emphasis";
import brendanCafe from "@/assets/brendan-cafe-landscape.jpg";
import brendanPostits from "@/assets/brendan-postits-landscape.jpg";
import notionAdmin from "@/assets/notion-certified-admin.png";
import notionAdvanced from "@/assets/notion-advanced.png";
import notionWorkflows from "@/assets/notion-workflows.png";
import notionEssentials from "@/assets/notion-essentials.png";

export const OffersGrid = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  const pillars = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Creative Consultancy",
      tagline: "Narratives & Strategy Services",
      description: "From workshops that align your team around story and positioning, to ongoing fractional partnerships that embed strategic and creative direction into your operations. For founders and teams who need their marketing to actually reach people.",
      services: [
        "Brand Connection Workshops — from £2k",
        "Fractional Strategy — monthly retainer",
        "Deep Engagement — 2-6 month projects",
      ],
      link: "/workshops",
      cta: "Explore Services",
      image: brendanCafe,
      imageAlt: "Creative strategy and brand direction",
    },
    {
      icon: <Cog className="w-6 h-6" />,
      title: "Notion & Systems Consultancy",
      tagline: "Workflows, AI & Operational Design",
      description: "Certified Notion administration, AI-powered workflow design, and operational systems that reduce cognitive load. Sessions, sprints, and retained support for teams ready to stop drowning in tabs and start shipping with confidence.",
      services: [
        "Notion Sessions — from £300",
        "Notion AI Mentorship Sprint — 6 weeks",
        "Retained Systems Support",
      ],
      link: "/notion-systems",
      cta: "Explore Services",
      image: brendanPostits,
      imageAlt: "Systems and workflow design",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`py-24 px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4'}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-5xl md:text-6xl mb-4 text-balance font-semibold italic">
            Ways to work <span className="relative inline-block">together
              <Emphasis className="absolute -bottom-2 left-0 right-0" delay={isVisible ? 0.5 : 999} />
            </span>
          </h2>
          <p className="text-base md:text-lg font-sans text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Two pillars. One goal: marketing and systems that make sense for your team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 flex flex-col"
            >
              {/* Card image header */}
              <div className="h-56 overflow-hidden">
                <img 
                  src={pillar.image} 
                  alt={pillar.imageAlt} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 md:p-10 flex flex-col flex-grow">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 text-accent">
                  {pillar.icon}
                </div>

                <h3 className="text-2xl md:text-3xl mb-2 font-semibold italic">
                  {pillar.title}
                </h3>

                <p className="text-sm font-sans text-accent mb-4">
                  {pillar.tagline}
                </p>

                <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                  {pillar.description}
                </p>

                <ul className="space-y-2 mb-6 flex-grow">
                  {pillar.services.map((service, idx) => (
                    <li key={idx} className="text-sm font-sans text-foreground/70 flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      {service}
                    </li>
                  ))}
                </ul>

                {/* Notion badges for systems card */}
                {index === 1 && (
                  <div className="flex items-center gap-2 mb-6 pt-2">
                    {[notionAdmin, notionAdvanced, notionWorkflows, notionEssentials].map((badge, i) => (
                      <img
                        key={i}
                        src={badge}
                        alt="Notion certification badge"
                        className="w-12 h-auto opacity-70 hover:opacity-100 transition-opacity"
                      />
                    ))}
                  </div>
                )}

                <PillButton className="w-full" icon={ArrowRight} asChild>
                  <a href={pillar.link}>{pillar.cta}</a>
                </PillButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};