import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  intro?: string | null;
  headerImage?: string | null;
  readingTime?: string | null;
  theme?: string | null;
  publishedDate?: string | null;
}

interface RelatedBlogsProps {
  currentSlug: string;
  featuredRelatedSlug?: string | null;
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

const formatPublishedDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const RelatedBlogs = ({ currentSlug, featuredRelatedSlug }: RelatedBlogsProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-blog-posts');
        
        if (error) {
          console.error("Error fetching blog posts:", error);
          return;
        }

        // Filter out current post and reorder with featured in center
        let allPosts: BlogPost[] = (data?.posts || []).filter(
          (post: BlogPost) => post.slug !== currentSlug
        );

        // If there's a featured related post, put it first (it will be centered)
        if (featuredRelatedSlug) {
          const featuredIndex = allPosts.findIndex(p => p.slug === featuredRelatedSlug);
          if (featuredIndex > -1) {
            const [featured] = allPosts.splice(featuredIndex, 1);
            // Insert at position 1 so it appears in the center when 3 are visible
            allPosts = [allPosts[0], featured, ...allPosts.slice(1)].filter(Boolean);
          }
        }

        setPosts(allPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentSlug, featuredRelatedSlug]);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  if (isLoading) {
    return (
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-light">
            Continue <span className="italic">Reading</span>
          </h2>
          
          {posts.length > 3 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {posts.map((post) => (
              <CarouselItem 
                key={post.id} 
                className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group cursor-pointer block h-full"
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

                      <h3 className="text-2xl mb-3 group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {post.intro && (
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.intro}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="italic">
                          Brendan @ Thread and Stack
                        </span>
                        {post.publishedDate && (
                          <span>
                            {formatPublishedDate(post.publishedDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
