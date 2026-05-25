import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import brendanAvatar from "@/assets/brendan-avatar.webp";
import { Loader2, Download } from "lucide-react";

interface CVContact {
  icon: string;
  text: string;
  href?: string;
}

interface CVSection {
  id: string;
  title: string;
  html: string;
}

interface CVData {
  name: string;
  title: string;
  contact: CVContact[];
  sections: CVSection[];
  lastEdited: string;
}

const fetchCV = async (): Promise<CVData> => {
  const { data, error } = await supabase.functions.invoke("fetch-cv");
  if (error) throw error;
  return data;
};

const CVPage = () => {
  // Block all indexing for /private/ pages
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cv"],
    queryFn: fetchCV,
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Unable to load CV.</p>
      </div>
    );
  }

  const profileSection = data.sections.find((s) => s.id === "profile");
  const expertiseSection = data.sections.find((s) => s.id === "expertise");
  const experienceSection = data.sections.find(
    (s) => s.id === "employment-history"
  );
  const educationSection = data.sections.find((s) => s.id === "education");

  // Render any other sections (Tools & Platforms, Certifications,
  // Notion Ambassador & Community, Skills & Capabilities, etc.) in the
  // main column between Experience and Education so new Notion sections
  // don't silently disappear.
  const reservedIds = new Set([
    "profile",
    "expertise",
    "employment-history",
    "education",
  ]);
  const extraSections = data.sections.filter((s) => !reservedIds.has(s.id));

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Hero header */}
      <header className="relative overflow-hidden">
        {/* Subtle gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] via-transparent to-accent/[0.03]" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 pt-10 pb-8 lg:pt-14 lg:pb-10">
          <div className="flex items-center gap-5 lg:gap-6">
            <img
              src={brendanAvatar}
              alt={data.name}
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-full ring-2 ring-accent/20 object-cover shadow-md"
            />
            <div>
              <h1 className="text-3xl lg:text-4xl font-serif-pro font-semibold italic tracking-tight text-foreground">
                {data.name}
              </h1>
              <p className="text-xs lg:text-sm font-sans uppercase tracking-[0.2em] text-muted-foreground mt-1.5">
                {data.title}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="h-px bg-border" />
        </div>
      </header>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main content */}
          <main className="lg:w-[62%] order-2 lg:order-1 space-y-10">
            {experienceSection && (
              <section>
                <SectionHeading>{experienceSection.title}</SectionHeading>
                <div
                  className="cv-experience"
                  dangerouslySetInnerHTML={{ __html: experienceSection.html }}
                />
              </section>
            )}

            {extraSections.map((section) => (
              <section key={section.id}>
                <SectionHeading>{section.title}</SectionHeading>
                <div
                  className="cv-skills"
                  dangerouslySetInnerHTML={{ __html: section.html }}
                />
              </section>
            ))}

            {educationSection && (
              <section>
                <SectionHeading>{educationSection.title}</SectionHeading>
                <div
                  className="cv-education"
                  dangerouslySetInnerHTML={{ __html: educationSection.html }}
                />
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-[38%] order-1 lg:order-2">
            <div className="lg:sticky lg:top-8 rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-[hsl(215,25%,12%)] text-white p-7 lg:p-8 space-y-7">
                {/* About Me */}
                {profileSection && (
                  <div>
                    <SidebarHeading>About Me</SidebarHeading>
                    <div
                      className="cv-sidebar-content text-white/80 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: profileSection.html }}
                    />
                  </div>
                )}

                {/* Expertise */}
                {expertiseSection && (
                  <div>
                    <SidebarHeading>Expertise</SidebarHeading>
                    <div
                      className="cv-sidebar-expertise"
                      dangerouslySetInnerHTML={{
                        __html: expertiseSection.html,
                      }}
                    />
                  </div>
                )}

                {/* Contact */}
                {data.contact.length > 0 && (
                  <div>
                    <SidebarHeading>Get in Touch</SidebarHeading>
                    <ul className="space-y-2.5">
                      {data.contact.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm"
                        >
                          {item.icon && (
                            <span className="text-base leading-5 shrink-0">
                              {item.icon}
                            </span>
                          )}
                          {item.href ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/80 hover:text-white transition-colors underline underline-offset-2 decoration-white/30"
                            >
                              {item.text}
                            </a>
                          ) : (
                            <span className="text-white/80">{item.text}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Download PDF link */}
                <a
                  href="https://drive.google.com/file/d/1QyrRitOcRqJ0zBZwx_O5WYVTjIVNK4cl/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors pt-4 border-t border-white/10"
                >
                  <Download className="w-4 h-4" />
                  Download CV as PDF
                </a>
              </div>

              {/* Last updated footer */}
              {data.lastEdited && (
                <div className="bg-[hsl(215,25%,9%)] px-7 lg:px-8 py-3">
                  <p className="text-[11px] text-white/30 tracking-wide">
                    Last updated{" "}
                    {new Date(data.lastEdited).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Minimal footer */}
      <footer className="max-w-6xl mx-auto px-6 lg:px-12 py-6">
        <div className="h-px bg-border mb-6" />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Brendan Rodgers · Powered by{" "}
          <a
            href="https://threadandstack.com"
            className="text-accent hover:underline"
          >
            Thread & Stack
          </a>
        </p>
      </footer>
    </div>
  );
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[11px] font-sans uppercase tracking-[0.25em] text-muted-foreground mb-6 pb-2 border-b border-border">
    {children}
  </h2>
);

const SidebarHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[11px] uppercase tracking-[0.25em] text-white/40 mb-3 font-sans">
    {children}
  </h2>
);

export default CVPage;
