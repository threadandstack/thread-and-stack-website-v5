import { Link } from "react-router-dom";
import type { WritingItem } from "@/lib/journalFeed";
import { groupCalendarPosts } from "@/lib/blogCalendar";
import { ArrowUpRight } from "lucide-react";

export function BlogCalendar({ posts }: { posts: WritingItem[] }) {
  const groups = groupCalendarPosts(posts);
  let previousMonth = "";
  return (
    <div className="mt-8 space-y-8" aria-label="Blog calendar">
      {groups.map(([date, entries]) => {
        const month = date === "undated" ? "undated" : date.slice(0, 7);
        const showMonth = month !== previousMonth;
        previousMonth = month;
        const parsed = date === "undated" ? null : new Date(`${date}T12:00:00Z`);
        return (
          <section key={date}>
            {showMonth && <h2 className="mb-5 font-serif text-3xl text-foreground">{parsed ? parsed.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }) : "Awaiting a publication date"}</h2>}
            <div className="grid gap-4 sm:grid-cols-[5rem_1fr]">
              <div className="text-muted-foreground">
                {parsed && <time dateTime={date} className="flex items-baseline gap-2 sm:block"><span className="block font-serif text-4xl text-foreground">{parsed.getUTCDate()}</span><span className="text-sm">{parsed.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" })}</span></time>}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {entries.map(post => <Link key={post.id} to={`/blog/${post.slug}`} className="group flex min-w-0 overflow-hidden rounded-lg bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {post.headerImage && <img src={post.headerImage} alt="" loading="lazy" className="w-20 shrink-0 object-cover object-top sm:w-24" />}
                  <div className="min-w-0 flex-1 p-4">
                    {post.theme && <p className="mb-2 text-xs text-muted-foreground">{post.theme}</p>}
                    <h3 className="break-words font-serif text-xl leading-snug">{post.title}</h3>
                    {(post.intro || post.description) && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.intro || post.description}</p>}
                    <ArrowUpRight className="mt-3 h-4 w-4 text-accent" aria-hidden="true" />
                  </div>
                </Link>)}
              </div>
            </div>
          </section>
        );
      })}
      {!groups.length && <p className="py-12 text-center text-muted-foreground">No published writing yet.</p>}
    </div>
  );
}