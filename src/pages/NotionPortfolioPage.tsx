import { PageSeo } from "@/components/seo/PageSeo";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { useParams } from "react-router-dom";

const NOTION_DB_ID = "2e08863b-87d4-81e2-bea8-f435421a841a";

const NotionPortfolioPage = () => {
  const { itemId } = useParams<{ itemId?: string }>();

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="Notion Portfolio — Thread & Stack"
        description="Selected Notion workspace, operating system, and automation builds from Thread & Stack."
        path="/portfolio/notion"
      />
      <Navigation />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
              Notion Systems Portfolio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl font-sans">
              Notion environments, automations, and system builds — operational
              infrastructure for teams that want to move faster.
            </p>
          </header>

          <PortfolioGallery
            databaseId={NOTION_DB_ID}
            pillar="notion"
            ctaLabel="Need a system that actually works?"
            initialItemId={itemId}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotionPortfolioPage;
