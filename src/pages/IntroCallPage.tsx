import { PageSeo } from "@/components/seo/PageSeo";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { IntroCallForm } from "@/components/home-draft2/IntroCallForm";
import { Clock, CheckCircle2, Sparkles } from "lucide-react";

const IntroCallPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageSeo
        title="Book an intro call with Thread & Stack"
        description="A free 30-minute intro call to talk through your project, pressure-test the brief, and see if Thread & Stack is the right fit."
        path="/intro-call"
      />
      <Navigation />

      <main className="relative">
        <section className="relative overflow-hidden border-b border-hairline bg-paper">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(closest-side, hsl(var(--indigo)), transparent)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(closest-side, hsl(var(--orange)), transparent)" }}
          />
          <div className="relative mx-auto max-w-3xl px-6 pb-12 pt-28 sm:px-8 md:pt-32">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background/70 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wider text-ink-soft backdrop-blur">
              <Sparkles className="h-3 w-3 text-indigo" strokeWidth={2} />
              Free intro call
            </div>
            <h1 className="mt-4 font-sans not-italic text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[44px]">
              Start with a{" "}
              <span className="font-serif-pro italic font-normal text-clay">
                free 30-minute introductory call.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">
              A no-pressure conversation about your stack, your team, and what
              you're trying to unlock. If a paid Stack Diagnostic turns out to
              be the right fit, we can book it from there.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-ink-soft">
              <li className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo" strokeWidth={2} /> 30 min live
              </li>
              <li className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-orange" strokeWidth={2} /> No cost, no obligation
              </li>
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-6 py-12 sm:px-8 md:py-16">
          <IntroCallForm source="intro-call-page" />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default IntroCallPage;
