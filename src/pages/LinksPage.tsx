import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Linkedin,
  ArrowRight,
  Calendar,
  Sparkles,
  BookOpen,
  Wrench,
  Mail,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/home-draft2/SectionHeader";
import PageSeo from "@/components/seo/PageSeo";
import avatar from "@/assets/photos/portraits/brendan-12.webp";
import photo1 from "@/assets/photos/shoreditch/brendan-34.webp";
import photo2 from "@/assets/photos/workshop/brendan-18.webp";
import photo3 from "@/assets/photos/portraits/brendan-9.webp";

const BlueskyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 568 501" className={className} fill="currentColor">
    <path d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.039C285.169 375.163 284.017 371.372 284 374.799C283.983 371.372 282.831 375.163 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0535 296.954 15.7778 224.501C9.94525 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z" />
  </svg>
);

const SubstackIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24l9.54-5.503 9.54 5.503V10.812H1.46zm0-8.242h21.08V0H1.46v2.57z" />
  </svg>
);

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  theme?: string | null;
  readingTime?: string | null;
  headerImage?: string | null;
  publishedDate?: string | null;
}

const PRIMARY_LINKS = [
  {
    label: "Book a free intro call",
    detail: "30 minutes, no obligation",
    to: "/work-with-me",
    icon: Calendar,
  },
  {
    label: "What I do",
    detail: "Narratives, strategy, Notion systems",
    to: "/services",
    icon: Sparkles,
  },
  {
    label: "Thread & Stack Journal",
    detail: "Writing, builds and events",
    to: "/journal",
    icon: BookOpen,
  },
  {
    label: "Take the 2-min Scorecard",
    detail: "A quick read on where things are stuck",
    to: "/scorecard",
    icon: Wrench,
  },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rodgersbrendan/", icon: Linkedin },
  { label: "Bluesky", href: "https://bsky.app/profile/threadandstack.com", icon: BlueskyIcon },
  {
    label: "Substack",
    href: "https://stackedbehaviours.substack.com/?utm_campaign=links",
    icon: SubstackIcon,
  },
];

const LinksPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let active = true;
    supabase.functions
      .invoke("fetch-blog-posts")
      .then(({ data }) => {
        if (active) setPosts((data?.posts || []).slice(0, 3));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme="light">
      <PageSeo
        title="Brendan Rodgers | Thread & Stack links"
        description="One place for everything Thread & Stack: book a call, read the journal, take the scorecard and follow along."
        path="/links"
        ogType="profile"
      />
      <Navigation variant="default" hideLogo />

      <main>
        {/* Hero */}
        <section className="relative">
          <div className="mx-auto max-w-3xl px-6 pb-16 pt-20 md:pb-20 md:pt-28">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-36 w-36 overflow-hidden rounded-full border border-hairline shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)] md:h-44 md:w-44">
                <img
                  src={avatar}
                  alt="Brendan Rodgers, founder of Thread & Stack"
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="mb-4 mt-8 inline-block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Thread &amp; Stack
              </span>

              <h1 className="font-serif-pro italic font-normal max-w-2xl text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[60px]">
                Everything in{" "}
                <span className="text-gradient-warm">one place.</span>
              </h1>

              <p className="mt-7 max-w-xl text-[16.5px] leading-relaxed text-ink-soft">
                I'm Brendan, an AI Ops Consultant. Below is the quickest route to my
                writing, my builds, and a conversation.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/work-with-me"
                  className="group inline-flex h-12 items-center rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px"
                  style={{
                    backgroundImage: "linear-gradient(95deg, var(--gradient-3color))",
                  }}
                >
                  Book a free intro call
                  <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </Link>
                <a
                  href="mailto:br@brendanrodgers.uk"
                  className="group inline-flex h-12 items-center gap-2 rounded-md border border-hairline bg-background px-6 text-[14.5px] font-medium text-foreground transition-colors hover:bg-paper"
                >
                  <Mail className="h-4 w-4" />
                  Email instead
                </a>
              </div>

              <nav
                aria-label="Social profiles"
                className="mt-8 flex items-center justify-center gap-3"
              >
                {SOCIALS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-background text-foreground/70 transition-all hover:-translate-y-px hover:text-clay"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </section>

        {/* Primary links */}
        <section>
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <SectionHeader eyebrow="Start here">
              The short <span className="text-gradient-warm">list.</span>
            </SectionHeader>

            <div className="space-y-3">
              {PRIMARY_LINKS.map(({ label, detail, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-4 rounded-2xl border border-hairline bg-background/70 p-5 backdrop-blur-sm transition-all hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline text-clay">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15.5px] font-medium">{label}</span>
                    <span className="mt-0.5 block text-[13.5px] text-ink-soft">{detail}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-clay" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Photos */}
        <section>
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3 px-6 pb-4 md:gap-5">
            {[photo1, photo2, photo3].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Brendan Rodgers at work"
                loading="lazy"
                className="aspect-[3/4] w-full rounded-2xl border border-hairline object-cover shadow-[0_16px_40px_-28px_rgba(0,0,0,0.4)]"
              />
            ))}
          </div>
        </section>

        {/* Latest writing */}
        {posts.length > 0 && (
          <section>
            <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
              <SectionHeader eyebrow="Journal">
                Latest <span className="text-gradient-warm">writing.</span>
              </SectionHeader>

              <div className="space-y-3">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-hairline bg-background/70 p-4 backdrop-blur-sm transition-all hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  >
                    {post.headerImage && (
                      <img
                        src={post.headerImage}
                        alt=""
                        loading="lazy"
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-medium leading-snug line-clamp-2 transition-colors group-hover:text-clay">
                        {post.title}
                      </span>
                      <span className="mt-1 block text-[12.5px] text-ink-soft">
                        {[post.theme, post.readingTime ? `${post.readingTime} min read` : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-clay"
                >
                  Read everything
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LinksPage;
