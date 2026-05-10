import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import StackedLogo from "@/assets/logos/Black_TS_Stacked.svg";

const IndexPickALane = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top nav */}
      <header className="w-full px-6 sm:px-10 pt-6 sm:pt-8 flex justify-end">
        <nav className="flex items-center gap-2 sm:gap-3 font-sans text-xs sm:text-sm tracking-[0.18em] uppercase text-foreground/80">
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <span aria-hidden className="text-foreground/40">//</span>
          <Link to="/how-i-work" className="hover:text-foreground transition-colors">Method</Link>
          <span aria-hidden className="text-foreground/40">//</span>
          <Link to="/blog" className="hover:text-foreground transition-colors">Journal</Link>
        </nav>
      </header>

      {/* Centre stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 pb-16">
        <img
          src={StackedLogo}
          alt="Thread & Stack"
          className="h-28 sm:h-36 md:h-40 w-auto mb-16 sm:mb-24"
        />

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 items-center gap-12 md:gap-8">
          {/* THE THREAD */}
          <Link
            to="/narratives-strategy"
            className="group flex flex-col items-center md:items-start text-center md:text-left"
          >
            <h2 className="font-serif-pro text-5xl sm:text-6xl font-bold leading-[0.95] tracking-tight">
              THE
              <br />
              THREAD
            </h2>
            <p className="mt-4 font-sans text-[11px] sm:text-xs tracking-[0.22em] uppercase text-foreground/70">
              Your why, your strategy
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-foreground/0 group-hover:text-foreground transition-colors">
              Enter <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* PICK A LANE */}
          <div className="flex flex-col items-center text-center">
            <p className="font-serif-pro italic text-2xl sm:text-3xl">Pick a lane</p>
            <div className="mt-4 flex items-center gap-2 text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span className="block w-24 sm:w-32 h-px bg-foreground" />
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* THE STACK */}
          <Link
            to="/notion-systems"
            className="group flex flex-col items-center md:items-end text-center md:text-right"
          >
            <h2 className="font-serif-pro text-5xl sm:text-6xl font-bold leading-[0.95] tracking-tight">
              THE
              <br />
              STACK
            </h2>
            <p className="mt-4 font-sans text-[11px] sm:text-xs tracking-[0.22em] uppercase text-foreground/70">
              AI biz ops &amp; rev ops
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-foreground/0 group-hover:text-foreground transition-colors">
              Enter <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default IndexPickALane;
