import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPostDetail {
  title: string;
  description: string;
  contentType: string;
  content: string;
  channels: string[];
}

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase.functions.invoke('fetch-blog-post', {
          body: { postId: id }
        });
        
        if (error) {
          console.error("Error fetching blog post:", error);
          return;
        }

        setPost(data?.post || null);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const getContentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Substack Article": "bg-orange-500",
      "LinkedIn Post": "bg-blue-500",
      "Website Copy": "bg-brown-500",
    };
    return colors[type] || "bg-gray-500";
  };

  if (isLoading) {
    return (
      <main className="min-h-screen relative pt-24">
        <Navigation />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen relative pt-24">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl mb-4">Post not found</h1>
          <p className="text-muted-foreground">This post may have been removed or doesn't exist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative pt-24">
      <Navigation />
      
      <article className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 mb-6 flex-wrap">
            <Badge className={`${getContentTypeColor(post.contentType)} text-white`}>
              {post.contentType}
            </Badge>
            {post.channels.map((channel) => (
              <Badge key={channel} variant="outline">
                {channel}
              </Badge>
            ))}
          </div>

          <h1 className="text-5xl md:text-6xl mb-6 font-light leading-tight">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed italic">
              {post.description}
            </p>
          )}

          <div 
            className="prose prose-lg max-w-none prose-headings:font-light prose-p:leading-relaxed prose-a:text-accent"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <Footer />
    </main>
  );
};

export default BlogPostPage;
