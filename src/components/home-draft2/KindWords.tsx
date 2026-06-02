import { TestimonialVariants, type Testimonial } from "@/components/TestimonialVariants";

const testimonials: Testimonial[] = [
  {
    headline: "Genuinely transformative",
    quote:
      "This Notion Mentorship sprint has been genuinely transformative for me. In just a few weeks, I significantly upped my productivity and efficiency, not just in how much I get done, but in how clearly I can show the value of my work.",
    author: "Jasmine Stone",
    date: "Marketing Manager",
  },
  {
    headline: "Hire Brendan, you won't regret it!",
    quote:
      "Brendan is like a Swiss army knife when it comes to marketing, strategic and hands-on. He helped me build a system that actually works for The IMMA Collective. I've got real peace of mind, a clear vision for the business, and marketing that feels properly joined up.",
    author: "Lilli Graf",
    date: "Apr 17, 2026",
  },
  {
    headline: "Brendan does great work!",
    quote:
      "Brendan did a terrific and patient job of untangling my Notion ineptitude. I'm saving time already with the new cleaned up format.",
    author: "Lucian James",
    date: "May 8, 2026",
  },
  {
    headline: "More progress in months than a year",
    quote:
      "Brendan has been a dream. His support totally invigorated us. We've made more progress in the last couple of months than we had in the previous year.",
    author: "Alex Aggidis",
    date: "Head of Marketing, Fundraising Everywhere",
  },
  {
    headline: "Tenacious and exceptional",
    quote:
      "Brendan is one of the most tenacious marketers I've met, fast to action plans with exceptional follow through to get the job done.",
    author: "Courtney Evans",
    date: "CEO, Funraisin",
  },
  {
    headline: "A safe pair of hands",
    quote:
      "Brendan is smart. He gets it quickly. He's a very safe pair of hands.",
    author: "Gary O'Donnell",
    date: "Operations Director, Dentsu Aegis",
  },
  {
    headline: "Big thinking, sharp strategy",
    quote:
      "Brendan constantly combined big thinking and strategic expertise to propose innovative new ideas for guiding content development, aligning deep research and analysis with project objectives and KPIs.",
    author: "Chris Mejaski",
    date: "Content Strategist, eBay",
  },
  {
    headline: "Built trust, boosted efficiency",
    quote:
      "Brendan quickly built trust among our DE/UK stakeholders, boosting marketing efficiency through creative strategy and consulting, and spearheading cross-functional collaboration across global marketing teams.",
    author: "Xania Khan",
    date: "Head of Content Strategy, eBay",
  },
  {
    headline: "Trends before anyone else",
    quote:
      "Brendan's extensive industry experience and knowledge of the latest marketing trends, before anyone else, makes every campaign feel exciting and innovative. His commitment and passion for delivering meaningful change, powered by tech, is inspiring.",
    author: "Matthew Ivo",
    date: "Marketing colleague",
  },
];

export function KindWords() {
  return (
    <section className="border-b border-hairline bg-background">
      <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-24">
        <div className="mb-6 flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-hairline bg-paper px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
            What clients say
          </div>
          <h2 className="font-sans not-italic max-w-3xl text-4xl font-medium leading-[1.03] tracking-[-0.025em] md:text-[52px]">
            A stack of{" "}
            <span className="font-serif-pro italic text-clay">kind words.</span>
          </h2>
        </div>
      </div>
      <TestimonialVariants testimonials={testimonials} />
    </section>
  );
}
