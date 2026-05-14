import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logos/Black_TS_Stacked.svg";

const HomePageDraft = () => {
  return (
    <main className="min-h-screen relative pt-24">
      <Navigation />

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <img
              src={journalLogo}
              alt="Thread & Stack"
              className="h-40 sm:h-56 md:h-80 w-auto"
            />
          </div>
          <p className="text-xl text-muted-foreground mb-8 text-center leading-relaxed max-w-2xl mx-auto">
            Thoughts on brand, creativity, and the systems that build our businesses.
          </p>

          <div className="flex justify-center mb-8">
            <Button>Get in touch</Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HomePageDraft;
