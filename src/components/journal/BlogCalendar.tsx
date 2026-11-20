import { Link } from "react-router-dom";
import type { JournalItem } from "@/lib/journalFeed";
import { groupCalendarPosts } from "@/lib/blogCalendar";
import { ArrowUpRight, BookOpen, CalendarDays, Hammer } from "lucide-react";

export function BlogCalendar({ posts }: { posts: JournalItem[] }) {
  const days = groupCalendarPosts(posts);
  const months = [...new Set(days.map(([date]) => date.slice(0, 7)))];
  return (
    <div className="mt-8 space-y-10" aria-label="Journal calendar">
      {months.map(month => <section key={month}>
        <h2 className="mb-5 font-serif text-3xl text-foreground">{new Date(`${month}-01T12:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })}</h2>
        <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {days.filter(([date]) => date.startsWith(month)).map(([date, entries]) => {
            const day = new Date(`${date}T12:00:00Z`);
            return <section key={date} className="min-w-0 overflow-hidden rounded-lg bg-card text-card-foreground shadow-sm" aria-label={date}>
              <time dateTime={date} className="flex items-baseline justify-between border-b border-border px-4 py-3"><span className="font-serif text-4xl">{day.getUTCDate()}</span><span className="text-sm text-muted-foreground">{day.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" })}</span></time>
              <div className="divide-y divide-border">
                {entries.map(item => {
                  const kind = item.kind;
                  const image = kind === "event" ? item.coverImage : item.headerImage;
                  const title = kind === "buildGroup" ? item.buildName : item.title;
                  const url = kind === "writing" ? `/blog/${item.slug}` : kind === "event" ? `/journal/events/${item.slug}` : `/journal/builds/${kind === "build" ? item.buildSlug || item.slug : item.slug}`;
                  const Icon = kind === "writing" ? BookOpen : kind === "event" ? CalendarDays : Hammer;
                  return <Link key={item.id} to={url} className="group block p-4 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <h3 className="mb-3 break-words font-serif text-xl leading-snug">{title}</h3>
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5" /><span>{kind === "writing" ? "Writing" : kind === "event" ? "Event" : "Build update"}</span><ArrowUpRight className="ml-auto h-4 w-4" /></div>
                    {image && <img src={image} alt="" loading="lazy" className="aspect-[3/1] w-full rounded object-cover object-top" />}
                  </Link>;
                })}
              </div>
            </section>;
          })}
        </div>
      </section>)}
      {!days.length && <p className="py-12 text-center text-muted-foreground">No dated entries in this selection.</p>}
      {posts.some(item => !item.date) && <p className="text-sm text-muted-foreground">Undated entries remain in card view.</p>}
    </div>
  );
}
