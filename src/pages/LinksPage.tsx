import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Linkedin,
  Instagram,
  ArrowRight,
  Calendar,
  Sparkles,
  BookOpen,
  Wrench,
  Mail,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import PageSeo from "@/components/seo/PageSeo";
import avatar from "@/assets/photos/shoreditch/brendan-31.webp";
import banner from "@/assets/photos/shoreditch/brendan-26.webp";

const CAL_LINK = "https://cal.com/thread-and-stack/15min-contactcard";

const BlueskyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 568 501" className={className} fill="currentColor">
    <path d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.039C285.169 375.163 284.017 371.372 284 374.799C283.983 371.372 282.831 375.163 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0535 296.954 15.7778 224.501C9.94525 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
    detail: "15 minutes, no obligation",
    href: CAL_LINK,
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
  { label: "X", href: "https://x.com/Brendan_on_X", icon: XIcon },
  { label: "Instagram", href: "https://www.instagram.com/brendanrodgersuk/", icon: Instagram },
  { label: "Bluesky", href: "https://bsky.app/profile/threadandstack.com", icon: BlueskyIcon },
];

const Toggle = ({
  eyebrow,
  title,
  defaultOpen = false,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-hairline py-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center gap-3 text-left"
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-soft transition-transform duration-300 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            {eyebrow}
          </span>
          <span className="mt-1 block font-serif-pro text-[26px] italic leading-tight tracking-[-0.02em]">
            {title}
          </span>
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

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
          <div className="relative h-44 w-full overflow-hidden md:h-64">
            <img
              src={banner}
              alt="Shoreditch street art near the Thread & Stack studio"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background" />
          </div>

          <div className="mx-auto max-w-3xl px-6 pb-14 md:pb-20">
            <div className="flex flex-col items-center text-center">
              <div className="relative -mt-20 h-36 w-36 overflow-hidden rounded-full border-4 border-background shadow-[0_16px_40px_-24px_rgba(0,0,0,0.45)] md:-mt-24 md:h-44 md:w-44">
                <img
                  src={avatar}
                  alt="Brendan Rodgers, founder of Thread & Stack"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <span className="mb-4 mt-8 inline-block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                HEY! THANKS FOR FINDING MY LINKS.
              </span>

              <h1 className="font-serif-pro italic font-normal max-w-2xl text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[60px]">
                <span className="block">Brendan's</span>
                <span className="block text-gradient-warm">Contact Card</span>
              </h1>

              <p className="mt-7 max-w-xl text-[16.5px] leading-relaxed text-ink-soft">
                I'm Brendan, an AI Ops Consultant. Below is the quickest route to my
                writing, my builds, and a conversation.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={CAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 items-center rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px"
                  style={{
                    backgroundImage: "linear-gradient(95deg, var(--gradient-3color))",
                  }}
                >
                  Book a free intro call
                  <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </a>
                <a
                  href="mailto:br@threadandstack.com"
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

        {/* Toggles */}
        <section>
          <div className="mx-auto max-w-3xl px-6 pb-20">
            <Toggle
              eyebrow="Start here"
              title={
                <>
                  The short <span className="text-gradient-warm">list.</span>
                </>
              }
              defaultOpen
            >
              <div className="space-y-3">
                {PRIMARY_LINKS.map(({ label, detail, to, href, icon: Icon }) => {
                  const inner = (
                    <>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline text-clay">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15.5px] font-medium">{label}</span>
                        <span className="mt-0.5 block text-[13.5px] text-ink-soft">{detail}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-clay" />
                    </>
                  );
                  const cls =
                    "group flex items-center gap-4 rounded-2xl border border-hairline bg-background/70 p-5 backdrop-blur-sm transition-all hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]";

                  return href ? (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cls}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link key={label} to={to!} className={cls}>
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </Toggle>

            {posts.length > 0 && (
              <Toggle
                eyebrow="Journal"
                title={
                  <>
                    Latest <span className="text-gradient-warm">writing.</span>
                  </>
                }
              >
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

                <div className="mt-6 flex justify-center">
                  <Link
                    to="/blog"
                    className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-clay"
                  >
                    Read everything
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Toggle>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LinksPage;
