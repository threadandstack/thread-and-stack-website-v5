import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const PrivacyPolicy = () => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("Privacy Policy");
  const [lastEdited, setLastEdited] = useState<string>("");
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("fetch-notion-page", {
          body: { pageTitle: "Privacy Policy" },
        });

        if (error) throw error;

        setTitle(data.title || "Privacy Policy");
        setContent(data.content);
        setLastEdited(data.lastEdited);
        setHeaderImage(data.headerImage || null);
      } catch (err: any) {
        console.error("Error fetching privacy policy:", err);
        setError("Unable to load privacy policy. Please try again later.");
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
        <article className="max-w-4xl mx-auto">
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
              {/* Header Image */}
              {headerImage && (
                <div className="aspect-[21/9] overflow-hidden rounded-2xl mb-12">
                  <img 
                    src={headerImage} 
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="max-w-3xl mx-auto">
                <header className="mb-12">
                  <h1 className="text-4xl md:text-5xl font-light mb-4">{title}</h1>
                  {formattedDate && (
                    <p className="text-sm text-muted-foreground">
                      Last updated: {formattedDate}
                    </p>
                  )}
                </header>
                
                <div 
                  className="blog-content prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </>
          )}
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
