import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { PasswordGate } from "@/components/PasswordGate";

const CREATIVE_DB_ID = "2808863b-87d4-8027-8f0e-fb1f70d684e0";

const CreativePortfolioPage = () => {
  return (
    <PasswordGate storageKey="portfolio-creative-unlocked" portfolio="creative">
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
                Narrative Strategy Portfolio
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl font-sans">
                Brand strategy, storytelling, and content work — shaping how organisations
                communicate with the people who matter most.
              </p>
            </header>

            <PortfolioGallery
              databaseId={CREATIVE_DB_ID}
              pillar="creative"
              ctaLabel="Ready to shape your narrative?"
            />
          </div>
        </main>

        <Footer />
      </div>
    </PasswordGate>
  );
};

export default CreativePortfolioPage;
