import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Sun, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import journalLogo from "@/assets/journal-logo.webp";
import { BlogNewsletterCTA } from "@/components/BlogNewsletterCTA";
import { SubscribeLightbox } from "@/components/SubscribeLightbox";
import { Tilt3D } from "@/components/Tilt3D";
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  intro?: string | null;
  headerImage?: string | null;
  url: string;
  readingTime?: string | null;
  theme?: string | null;
  publishedDate?: string | null;
  featured?: boolean;
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

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSubscribe, setShowSubscribe] = useState(searchParams.get('subscribe') === 'true');
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // Get unique themes from posts
  const themes = [...new Set(posts.map(p => p.theme).filter(Boolean))] as string[];

  // Filter posts by active theme
  const filteredPosts = activeTheme
    ? posts.filter(p => p.theme === activeTheme)
    : posts;

  const handleSubscribeChange = (open: boolean) => {
    setShowSubscribe(open);
    if (!open) {
      // Remove subscribe param from URL when closing
      searchParams.delete('subscribe');
      setSearchParams(searchParams, { replace: true });
    }
  };
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
      <SubscribeLightbox open={showSubscribe} onOpenChange={handleSubscribeChange} />
      
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Tilt3D>
              <img src={journalLogo} alt="Thread & Stack Journal" className="h-40 sm:h-56 md:h-80 w-auto" />
            </Tilt3D>
          </div>
          <p className="text-xl text-muted-foreground mb-8 text-center leading-relaxed max-w-2xl mx-auto">
            Thoughts on brand, creativity, and the systems that build our businesses.
          </p>

          <div className="flex justify-center mb-8">
            <BlogNewsletterCTA />
          </div>

          {/* Theme Filters */}
          {!isLoading && themes.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <button
                onClick={() => setActiveTheme(null)}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  activeTheme === null
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All
              </button>
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setActiveTheme(theme)}
                  className={`px-4 py-2 text-sm rounded-full transition-all ${
                    activeTheme === theme
                      ? 'bg-foreground text-background'
                      : `${getThemeColors(theme)} hover:opacity-80`
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Featured Article - only show when no filter active or filter matches */}
              {filteredPosts.find(p => p.featured) && !activeTheme && (
                <div className="mb-12">
                  {(() => {
                    const featuredPost = filteredPosts.find(p => p.featured)!;
                    return (
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="group cursor-pointer block"
                      >
                        <Card className="transition-all hover:shadow-lg overflow-hidden">
                          <div className="grid md:grid-cols-2 gap-0">
                            {featuredPost.headerImage && (
                              <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                                <img 
                                  src={featuredPost.headerImage} 
                                  alt={featuredPost.title}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                            )}
                            <div className="p-8 flex flex-col justify-center">
                              <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 text-sm rounded-full bg-accent text-accent-foreground">
                                  Featured
                                </span>
                                {featuredPost.theme && (
                                  <span className={`px-3 py-1 text-sm rounded-full ${getThemeColors(featuredPost.theme)}`}>
                                    {featuredPost.theme}
                                  </span>
                                )}
                                {featuredPost.readingTime && (
                                  <span className="text-sm text-muted-foreground">
                                    {featuredPost.readingTime} min read
                                  </span>
                                )}
                              </div>

                              <h2 className="text-3xl md:text-4xl mb-4 group-hover:text-accent transition-colors font-light">
                                {featuredPost.title}
                              </h2>

                              {featuredPost.description && (
                                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                                  {featuredPost.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span className="italic">
                                  Brendan @ Thread and Stack
                                </span>
                                {featuredPost.publishedDate && (
                                  <span>
                                    {formatPublishedDate(featuredPost.publishedDate)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })()}
                </div>
              )}

              {/* Regular Articles Grid */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {(activeTheme ? filteredPosts : filteredPosts.filter(p => !p.featured)).map((post) => (
                  <Link
                    key={post.id}
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

                        <h2 className="text-2xl mb-3 group-hover:text-accent transition-colors">
                          {post.title}
                        </h2>

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
                ))}

                {(activeTheme ? filteredPosts : filteredPosts.filter(p => !p.featured)).length === 0 && !isLoading && (
                  <div className="col-span-full text-center py-20">
                    <p className="text-xl text-muted-foreground">
                      {activeTheme ? `No posts in "${activeTheme}" yet.` : 'No published posts yet. Check back soon.'}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BlogPage;
