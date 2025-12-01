import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  headerImage?: string | null;
  url: string;
  readingTime?: string | null;
  theme?: string | null;
}

const getThemeColors = (theme: string): string => {
  const themeMap: Record<string, string> = {
    'Growth': 'bg-emerald-100 text-emerald-700',
    'Strategy': 'bg-orange-100 text-orange-700',
    'Creative': 'bg-pink-100 text-pink-700',
    'Systems': 'bg-blue-100 text-blue-700',
    'Case Studies': 'bg-accent/10 text-accent',
  };
  return themeMap[theme] || 'bg-accent/10 text-accent';
};

const BlogNewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { email }
      });
      if (error) throw error;
      toast({
        title: "Subscribed!",
        description: "You've been added to the newsletter."
      });
      setEmail("");
    } catch (error: any) {
      const errorMessage = error?.message?.includes('already subscribed') 
        ? "This email is already subscribed." 
        : "Please try again.";
      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mb-16 text-center bg-muted/50 rounded-xl p-6 border border-border/30">
      <p className="text-foreground font-medium mb-4">
        Notify me about the next issue ↓
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-background border-border/50"
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          variant="outline"
          className="shrink-0"
        >
          {isSubmitting ? "..." : "Subscribe"}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground/70 mt-3">
        By subscribing, you agree to receive emails from Thread & Stack. You can unsubscribe at any time. We respect your privacy and will never share your data.
      </p>
    </div>
  );
};

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-blog-posts');
        
        if (error) {
          console.error("Error fetching blog posts:", error);
          return;
        }

        setPosts(data?.posts || []);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen relative pt-24">
      <Navigation />
      
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl mb-6 font-light text-center">
            Stacked <span className="italic">Behaviours</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 text-center leading-relaxed max-w-2xl mx-auto">
            Thoughts on brand, creativity, and the systems that build our businesses.
          </p>

          <BlogNewsletterCTA />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group cursor-pointer"
                >
                  <Card className="h-full transition-all hover:shadow-lg overflow-hidden">
                    {post.headerImage && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={post.headerImage} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        {post.theme && (
                          <span className={`px-3 py-1 text-sm rounded-full ${getThemeColors(post.theme)}`}>
                            {post.theme}
                          </span>
                        )}
                        {post.readingTime && (
                          <span className="text-sm text-muted-foreground">
                            {post.readingTime} min read
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-sm text-muted-foreground italic">
                        Brendan @ Thread and Stack
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}

              {posts.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-20">
                  <p className="text-xl text-muted-foreground">
                    No published posts yet. Check back soon.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BlogPage;
