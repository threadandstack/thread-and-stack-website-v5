import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, ArrowUpRight, Calendar, Sparkles, BookOpen, Wrench, Mail, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PillButton } from "@/components/ui/pill-button";
import { Footer } from "@/components/Footer";
import PageSeo from "@/components/seo/PageSeo";
import heroImage from "@/assets/photos/shoreditch/brendan-33.webp";
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
    label: "Book an intro call",
    detail: "Free 30 minutes, no pitch",
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
    label: "Take the scorecard",
    detail: "Five minutes on where things are stuck",
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
    <main className="min-h-screen bg-background">
      <PageSeo
        title="Brendan Rodgers | Thread & Stack links"
        description="One place for everything Thread & Stack: book a call, read the journal, take the scorecard and follow along."
        path="/links"
        ogType="profile"
      />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[52vh] min-h-[320px] overflow-hidden">
          <img
            src={heroImage}
            alt="Brendan Rodgers, founder of Thread & Stack"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "44% 38%" }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative -mt-24 md:-mt-28 w-full max-w-xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-background/95 backdrop-blur-sm p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/8 px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              <span className="font-sans text-xs font-medium uppercase tracking-wide text-accent">
                Taking on new clients
              </span>
            </div>

            <h1 className="mb-4 font-sans not-italic text-4xl md:text-5xl font-semibold leading-[1] tracking-[-0.035em] text-balance">
              Stories that{" "}
              <span className="font-serif-pro italic text-accent text-5xl md:text-6xl">land</span>.
              <br />
              Systems that{" "}
              <span className="font-serif-pro italic text-accent text-5xl md:text-6xl">stick</span>.
            </h1>

            <p className="mb-6 font-sans text-base leading-relaxed text-muted-foreground">
              I'm Brendan Rodgers. Everything Thread &amp; Stack in one place:{" "}
              <span className="font-medium text-foreground">writing</span>,{" "}
              <span className="font-medium text-foreground">builds</span> and the fastest way to
              reach me.
            </p>

            <PillButton size="lg" icon={Rocket} className="font-semibold" asChild>
              <Link to="/work-with-me">Book an Intro Call</Link>
            </PillButton>

            <nav
              aria-label="Social profiles"
              className="mt-6 flex gap-3 border-t border-border/50 pt-5"
            >
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
              <Link
                to="/work-with-me"
                aria-label="Get in touch"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:text-accent"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </nav>
          </div>
        </div>
      </section>

      {/* Primary links */}
      <section className="bg-card px-4 sm:px-6 py-16 mt-12">
        <div className="mx-auto w-full max-w-xl">
          <h2 className="mb-8 text-3xl md:text-4xl font-semibold italic leading-tight text-balance">
            Start here.
          </h2>
          <div className="space-y-3">
            {PRIMARY_LINKS.map(({ label, detail, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center gap-4 rounded-2xl bg-background p-4 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sans font-medium">{label}</span>
                  <span className="block font-sans text-sm text-muted-foreground">{detail}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="px-4 sm:px-6 py-16">
        <div className="mx-auto grid w-full max-w-xl grid-cols-3 gap-3">
          {[photo1, photo2, photo3].map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Brendan Rodgers at work"
              loading="lazy"
              className="aspect-[3/4] w-full rounded-2xl object-cover shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
            />
          ))}
        </div>
      </section>

      {/* Latest writing */}
      {posts.length > 0 && (
        <section className="bg-card px-4 sm:px-6 py-16">
          <div className="mx-auto w-full max-w-xl">
            <h2 className="mb-8 text-3xl md:text-4xl font-semibold italic leading-tight">
              Latest writing.
            </h2>
            <div className="space-y-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group flex items-center gap-4 rounded-2xl bg-background p-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
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
                    <span className="block font-sans font-medium leading-snug line-clamp-2 group-hover:text-accent">
                      {post.title}
                    </span>
                    <span className="mt-1 block font-sans text-xs text-muted-foreground">
                      {[post.theme, post.readingTime ? `${post.readingTime} min read` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
            <Link
              to="/blog"
              className="relative mt-6 inline-block w-fit font-sans text-sm text-accent transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-accent/80 hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              Read everything →
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default LinksPage;
