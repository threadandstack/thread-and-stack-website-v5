import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const NOTION_PAGE_ID = "1fc8863b87d4801fac0ac9fddd7a1ed4";

const DataGuarantee = () => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("Data Guarantee");
  const [lastEdited, setLastEdited] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("fetch-notion-page", {
          body: { pageId: NOTION_PAGE_ID },
        });

        if (error) throw error;

        setTitle(data.title || "Data Guarantee");
        setContent(data.content);
        setLastEdited(data.lastEdited);
      } catch (err: any) {
        console.error("Error fetching data guarantee:", err);
        setError("Unable to load data guarantee. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const formattedDate = lastEdited
    ? new Date(lastEdited).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <div className="space-y-3 mt-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : (
            <>
              <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-serif mb-4">{title}</h1>
                {formattedDate && (
                  <p className="text-sm text-muted-foreground">
                    Last updated: {formattedDate}
                  </p>
                )}
              </header>
              
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:font-serif prose-headings:font-normal
                  prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-4
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-ul:my-4 prose-ol:my-4
                  prose-li:text-foreground/90 prose-li:mb-2
                  prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                  prose-strong:text-foreground
                  prose-hr:border-border prose-hr:my-8"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </>
          )}
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default DataGuarantee;
