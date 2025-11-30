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
  headerImage?: string | null;
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
      "Longform": "bg-orange-500",
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
        <div className="max-w-4xl mx-auto">
          {post.headerImage && (
            <div className="aspect-[21/9] overflow-hidden rounded-2xl mb-12">
              <img 
                src={post.headerImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

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
              className="prose prose-lg max-w-none prose-headings:font-light prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:mb-6 prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-a:text-accent prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-img:rounded-lg prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-figcaption:mt-2 prose-hr:border-border prose-strong:font-semibold [&_.callout]:bg-muted [&_.callout]:p-4 [&_.callout]:rounded-lg [&_.callout]:flex [&_.callout]:gap-3 [&_.callout-icon]:text-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
};

export default BlogPostPage;
