import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BlogNewsletterCTA } from "@/components/BlogNewsletterCTA";
import { BlogCTACallout } from "@/components/BlogCTACallout";
import { RelatedBlogs } from "@/components/RelatedBlogs";
import { FAQ } from "@/components/FAQ";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import brendanAvatar from "@/assets/brendan-avatar.png";
import { trackBlogRead } from "@/hooks/useAnalytics";
import { sanitizeHtml } from "@/lib/sanitize";

interface BlogPostDetail {
  title: string;
  description: string;
  headerImage?: string | null;
  content: string;
  readingTime?: string | null;
  theme?: string | null;
  lastEditedTime?: string | null;
}

const getThemeColor = (theme: string | null | undefined) => {
  switch (theme?.toLowerCase()) {
    case 'growth':
      return 'bg-emerald-100 text-emerald-800';
    case 'strategy':
      return 'bg-orange-100 text-orange-800';
    case 'creative':
      return 'bg-pink-100 text-pink-800';
    case 'systems':
      return 'bg-blue-100 text-blue-800';
    case 'case studies':
      return 'bg-accent/20 text-accent';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const formatLastEdited = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [featuredRelatedSlug, setFeaturedRelatedSlug] = useState<string | null>(null);
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

  // Fetch SEO data for featured related blog
  useEffect(() => {
    const fetchSeoData = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from('page_seo')
        .select('featured_related_blog_slug')
        .eq('page_path', `/blog/${slug}`)
        .single();

      if (!error && data?.featured_related_blog_slug) {
        setFeaturedRelatedSlug(data.featured_related_blog_slug);
      }
    };

    fetchSeoData();
  }, [slug]);

  // Track blog read
  useEffect(() => {
    if (post && slug) {
      trackBlogRead(post.title, slug);
    }
  }, [post, slug]);

  // Update meta tags for social sharing
  useEffect(() => {
    if (!post) return;

    const siteUrl = window.location.origin;
    const pageUrl = `${siteUrl}/blog/${slug}`;
    const imageUrl = post.headerImage || `${siteUrl}/images/websiteshare.png`;

    // Helper to update or create meta tag
    const setMetaTag = (property: string, content: string, isName = false) => {
      const attr = isName ? 'name' : 'property';
      let element = document.querySelector(`meta[${attr}="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update document title
    const originalTitle = document.title;
    document.title = `${post.title} | Thread & Stack`;

    // Open Graph tags
    setMetaTag('og:title', post.title);
    setMetaTag('og:description', post.description || '');
    setMetaTag('og:image', imageUrl);
    setMetaTag('og:url', pageUrl);
    setMetaTag('og:type', 'article');

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:title', post.title, true);
    setMetaTag('twitter:description', post.description || '', true);
    setMetaTag('twitter:image', imageUrl, true);

    // Cleanup on unmount
    return () => {
      document.title = originalTitle;
    };
  }, [post, slug]);

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
          {/* Header Image - Now above title */}
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
            {/* Title */}
            <h1 className="text-5xl md:text-6xl mb-6 font-light leading-tight">
              {post.title}
            </h1>

            {/* Meta info: Author, Category, Read time, Last edited */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
              <div className="flex items-center gap-3">
                <img 
                  src={brendanAvatar} 
                  alt="Brendan" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-muted-foreground">
                  Brendan @ Thread and Stack
                </span>
              </div>
              {post.theme && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getThemeColor(post.theme)}`}>
                  {post.theme}
                </span>
              )}
              {post.readingTime && (
                <span className="text-muted-foreground">
                  {post.readingTime} min read
                </span>
              )}
              {post.lastEditedTime && (
                <>
                  <span className="text-muted-foreground/50">|</span>
                  <span className="text-muted-foreground">
                    Updated {formatLastEdited(post.lastEditedTime)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {post.description && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed italic">
                {post.description}
              </p>
            )}

            {/* Subscribe button (collapsible) */}
            <div className="mb-12">
              <BlogNewsletterCTA />
            </div>

            {/* Content */}
            <div 
              className="blog-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            />

            {/* Subtle CTA Callout */}
            <BlogCTACallout theme={post.theme} title={post.title} />
          </div>
        </div>
      </article>

      {/* Related Blogs Carousel */}
      <RelatedBlogs currentSlug={slug || ''} featuredRelatedSlug={featuredRelatedSlug} />

      <FAQ items={[
        {
          question: "What is the Thread & Stack Journal?",
          answer: "Thread & Stack Journal is our blog exploring the intersection of brand, creativity, and systems that build our businesses. I share thoughts on behavioural strategy, AI in marketing, and honest takes on running a purpose-driven practice. Subscribe and I'll send you monthly signals on building brands that stay true while scaling."
        },
        {
          question: "What topics do you cover?",
          answer: "The blog focuses on three core areas: brand strategy and positioning for purpose-led organisations, AI integration in marketing workflows (with a human-centred approach), and practical systems thinking for reducing cognitive load and creative tax. Topics range from behavioural psychology in marketing to Notion workspace design to the ethics of AI in creative work."
        },
        {
          question: "How does this relate to Thread & Stack's services?",
          answer: "The blog extends the thinking behind Thread & Stack's two core pillars: Narratives & Strategy Services (Strategy Sessions, Fractional Strategy Director, Project Engagements) and Notion & Systems Consultancy (Notion Sessions, Fractional Automations Director, System-Build Engagements). It's where I share the philosophy, frameworks, and learnings that inform the work."
        },
        {
          question: "Who is Thread & Stack for?",
          answer: "We work with purpose-led organisations across two main profiles: values-driven founders and small organisations (like B Corps, social enterprises, and nonprofits) who prioritise impact and integrity as they grow, and scaling teams (typically 2–50 people) led by founder-operators who need to cut through unclear positioning and messy operational systems to focus on what matters."
        },
        {
          question: "How do I work with Thread & Stack?",
          answer: "We work across two pillars. Narratives & Strategy Services covers Strategy Sessions, Fractional Strategy Director retainers, and Project Engagements. Notion & Systems Consultancy covers Notion Sessions, Fractional Automations Director retainers, and System-Build Engagements. Book an intro call to find the right fit."
        }
      ]} title="About Thread & Stack Journal" />
      <Footer />
    </main>
  );
};

export default BlogPostPage;
