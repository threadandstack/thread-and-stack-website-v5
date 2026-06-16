import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Credentials } from "@/components/home-draft2/Credentials";
import { FAQ } from "@/components/home-draft2/FAQ";
import { CTA } from "@/components/home-draft2/CTA";
import { SectionHeader } from "@/components/home-draft2/SectionHeader";
import { ArrowRight } from "lucide-react";
import brendanWalking from "@/assets/photos/shoreditch/brendan-27.webp";

const AboutPage = () => {
  return (
    <div className="notion-canvas min-h-screen overflow-x-hidden">
      <Navigation variant="image-hero" />

      <main>
        {/* Hero — mobile stacked */}
        <section className="md:hidden">
          <div className="relative h-[58vh]">
            <img
              src={brendanWalking}
              alt="Brendan walking past street art in Shoreditch"
              className="absolute inset-0 h-full w-full object-cover object-[65%_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <span className="mb-3 inline-block text-[11px] uppercase tracking-[0.22em] text-white/75">
                About
              </span>
              <h1 className="font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] text-white">
                Background &amp; <span className="text-clay">experience.</span>
              </h1>
            </div>
          </div>

          <div className="bg-background px-6 pb-12 pt-10">
            <div className="space-y-4 text-[15.5px] leading-relaxed text-ink-soft">
              <p>
                I studied Media, Communications &amp; Culture and Philosophy at Keele University, a
                combination that wasn't common at the time. Media Communications were dismissed as
                a "Mickey Mouse degree," and Philosophy was seen as a waste of time. I chose it
                because I saw the impact these two subjects could have together. Now, these
                disciplines underpin our modern world.
              </p>
              <p>
                That golden thread, following the ethics and impact of communications and culture,
                took me on a path working with a really wide range of clients and products. From
                international consultancies like Dentsu B2B working with some of the biggest brands
                in the world, to Global Content Strategy Lead at eBay developing strategy with
                worldwide impact.
              </p>
              <p>
                At agencies like Funraisin, Lightful, Scoota, and Aqueduct (now Flipside), I got
                front-row seats to best UX, CX and Accessibility practices. Among them are
                enterprise brands, to small nonprofits. Hollywood movies to more local consumer
                insurance ads.
              </p>
              <p className="text-foreground">
                Now I focus on one thing: helping purpose-led teams protect what matters while
                building brands that actually grow. The problem is always clarity. Strategic
                positioning paired with strong design craft. That's where I can help.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
              <a
                href="/how-i-work"
                className="group inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-clay"
              >
                The Thread &amp; Stack way
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="/services"
                className="group inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-clay"
              >
                Services
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Hero — desktop full-bleed overlay */}
        <section className="relative hidden md:flex min-h-[88vh] items-end">
          <img
            src={brendanWalking}
            alt="Brendan walking past street art in Shoreditch"
            className="absolute inset-0 h-full w-full object-cover object-[75%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          <div className="relative z-10 w-full px-6 pb-20 pt-32 md:px-10">
            <div className="mx-auto max-w-5xl">
              <span className="mb-5 inline-block text-[11px] uppercase tracking-[0.22em] text-white/75">
                About
              </span>
              <h1 className="font-serif-pro italic font-normal text-balance text-5xl leading-[1.03] tracking-[-0.02em] text-white md:text-[72px]">
                Background &amp; <span className="text-clay">experience.</span>
              </h1>

              <div className="mt-8 max-w-2xl space-y-4 text-[16px] leading-relaxed text-white/85">
                <p>
                  I studied Media, Communications &amp; Culture and Philosophy at Keele University,
                  a combination that wasn't common at the time. Media Communications were
                  dismissed as a "Mickey Mouse degree," and Philosophy was seen as a waste of
                  time. I chose it because I saw the impact these two subjects could have
                  together. Now, these disciplines underpin our modern world.
                </p>
                <p>
                  That golden thread, following the ethics and impact of communications and
                  culture, took me on a path working with a really wide range of clients and
                  products. From international consultancies like Dentsu B2B working with some of
                  the biggest brands in the world, to Global Content Strategy Lead at eBay
                  developing strategy with worldwide impact.
                </p>
                <p>
                  At agencies like Funraisin, Lightful, Scoota, and Aqueduct (now Flipside), I got
                  front-row seats to best UX, CX and Accessibility practices. Among them are
                  enterprise brands, to small nonprofits. Hollywood movies to more local consumer
                  insurance ads.
                </p>
                <p className="text-white">
                  Now I focus on one thing: helping purpose-led teams protect what matters while
                  building brands that actually grow. The problem is always clarity. Strategic
                  positioning paired with strong design craft. That's where I can help.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14.5px]">
                <a
                  href="/how-i-work"
                  className="group inline-flex items-center gap-1.5 font-medium text-white transition-colors hover:text-clay"
                >
                  The Thread &amp; Stack way
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="/services"
                  className="group inline-flex items-center gap-1.5 font-medium text-white transition-colors hover:text-clay"
                >
                  Services
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Credentials — reuse home-draft2 styling */}
        <Credentials />

        {/* FAQ — reuse home-draft2 FAQ */}
        <section>
          <div className="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-24">
            <SectionHeader eyebrow="FAQ">
              Hard <span className="text-clay">questions.</span>
            </SectionHeader>
            <FAQ />
          </div>
        </section>

        <CTA theme="light" />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
