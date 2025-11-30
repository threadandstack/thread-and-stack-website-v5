import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  contentType: string;
  status: string;
  url: string;
  channels: string[];
}

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

  const getContentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Substack Article": "bg-orange-500",
      "LinkedIn Post": "bg-blue-500",
      "Website Copy": "bg-brown-500",
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <main className="min-h-screen relative pt-24">
      <Navigation />
      
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl mb-6 font-light text-center">
            Stacked <span className="italic">Behaviours</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-16 text-center leading-relaxed max-w-2xl mx-auto">
            Thoughts on brand, creativity, and the systems that build our businesses.
          </p>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card 
                  key={post.id}
                  className="p-8 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <Link to={`/blog/${post.id}`}>
                    <div className="flex gap-3 mb-4 flex-wrap">
                      <Badge className={`${getContentTypeColor(post.contentType)} text-white`}>
                        {post.contentType}
                      </Badge>
                      {post.channels.map((channel) => (
                        <Badge key={channel} variant="outline">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="text-3xl mb-3 font-light hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="text-muted-foreground leading-relaxed">
                        {post.description}
                      </p>
                    )}
                  </Link>
                </Card>
              ))}

              {posts.length === 0 && !isLoading && (
                <div className="text-center py-20">
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
