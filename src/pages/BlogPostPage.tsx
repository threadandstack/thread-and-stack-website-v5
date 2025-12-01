import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";
import { FAQ } from "@/components/FAQ";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPostDetail {
  title: string;
  description: string;
  contentType: string;
  headerImage?: string | null;
  content: string;
  readingTime?: number;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase.functions.invoke('fetch-blog-post', {
          body: { slug }
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
  }, [slug]);

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
            <div className="flex gap-3 mb-6 flex-wrap items-center">
              <Badge className={`${getContentTypeColor(post.contentType)} text-white`}>
                {post.contentType}
              </Badge>
              {post.readingTime && (
                <span className="text-sm text-muted-foreground">
                  {post.readingTime} min read
                </span>
              )}
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
              className="blog-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>

      <Newsletter />
      <FAQ items={[
        {
          question: "What is Stacked Behaviours?",
          answer: "Stacked Behaviours is Thread & Stack's blog exploring the intersection of brand, creativity, and systems that build our businesses. I share thoughts on behavioral strategy, AI in marketing, and honest takes on running a purpose-driven practice. Subscribe and I'll send you monthly signals on building brands that stay true while scaling."
        },
        {
          question: "What topics do you cover?",
          answer: "The blog focuses on three core areas: brand strategy and positioning for purpose-led organizations, AI integration in marketing workflows (with a human-centered approach), and practical systems thinking for reducing cognitive load and creative tax. Topics range from behavioral psychology in marketing to Notion workspace design to the ethics of AI in creative work."
        },
        {
          question: "How does this relate to Thread & Stack's services?",
          answer: "The blog extends the thinking behind Thread & Stack's core offerings: Clarity Sessions (rapid strategic intervention), Thread AI Mentorship Sprint (AI workflow building), Brand Connection Workshops (modular strategy system), Fractional Strategy (ongoing partnership), and Deep Engagement (transformation projects). It's where I share the philosophy, frameworks, and learnings that inform the work."
        },
        {
          question: "What is Thread & Stack's approach to AI?",
          answer: "We see AI as a second brain and operations partner in the background - never a replacement for human creativity or judgment. Our AI Philosophy centers on creative empowerment: helping you feel more capable and confident, ensuring your brand voice remains authentically yours, and reducing cognitive load so your calendar feels spacious instead of suffocating. AI gives back time, attention, and voice."
        },
        {
          question: "Who is Thread & Stack for?",
          answer: "We work with purpose-led organizations across two main profiles: values-driven founders and small organizations (like B Corps, social enterprises, and nonprofits) who prioritize impact and integrity as they grow, and scaling teams (typically 2-50 people) led by founder-operators who are wearing too many hats and need to cut through unclear positioning and messy operational systems to focus on what matters."
        },
        {
          question: "How do I work with Thread & Stack?",
          answer: "We offer five core services across different levels of commitment: Clarity Sessions (60-minute strategic power hours, from £300), Thread AI Mentorship Sprint (6-week 1:1 mentorship, from £1k), Brand Connection Workshops (modular team workshops, from £2k), Fractional Strategy (monthly retainer for ongoing support), and Deep Engagement (2-6 month transformation projects, from £10-25k). Start with a Clarity Session or book a discovery call."
        }
      ]} />
      <Footer />
    </main>
  );
};

export default BlogPostPage;
