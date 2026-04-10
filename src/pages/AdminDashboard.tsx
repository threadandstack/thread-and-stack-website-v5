import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LogOut, Loader2, Search, BookOpen, Image, BarChart3, RefreshCw, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, signOut } = useAdminAuth();
  const [isSyncingBlog, setIsSyncingBlog] = useState(false);
  const [isSyncingPortfolio, setIsSyncingPortfolio] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    } else if (!authLoading && user && !isAdmin) {
      toast.error("You don't have admin access");
      signOut();
      navigate("/admin/login");
    }
  }, [authLoading, user, isAdmin, navigate, signOut]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleSyncBlogCache = async () => {
    setIsSyncingBlog(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-blog-cache');
      if (error) throw error;
      toast.success(`Blog cache synced — ${data.synced} listings, ${data.content_synced} posts rendered`);
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync blog cache');
    } finally {
      setIsSyncingBlog(false);
    }
  };

  const handleSyncPortfolioCache = async () => {
    setIsSyncingPortfolio(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-portfolio-cache');
      if (error) throw error;
      toast.success(`Portfolio synced — ${data.listings_synced} listings, ${data.content_synced} pages rendered`);
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync portfolio cache');
    } finally {
      setIsSyncingPortfolio(false);
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  const adminSections = [
    {
      title: "Analytics",
      description: "View website visits, sessions, top pages, and bounce rates",
      icon: BarChart3,
      href: "/admin/analytics",
    },
    {
      title: "SEO Manager",
      description: "Manage meta tags, OG images, and social sharing for all pages",
      icon: Search,
      href: "/admin/seo",
    },
    {
      title: "Brand Book",
      description: "View brand guidelines, colors, typography, and assets",
      icon: BookOpen,
      href: "/brand-book",
    },
    {
      title: "Image Library",
      description: "Browse and manage project images and assets",
      icon: Image,
      href: "/admin/images",
    },
    {
      title: "Portfolio Access",
      description: "Track portfolio views and manage access codes by funnel",
      icon: KeyRound,
      href: "/admin/portfolio-access",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your site content and settings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Blog Cache Sync */}
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Blog Cache</CardTitle>
                  <CardDescription>Sync blog listings and pre-render post content from Notion</CardDescription>
                </div>
              </div>
              <Button onClick={handleSyncBlogCache} disabled={isSyncingBlog}>
                {isSyncingBlog ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Syncing…</>
                ) : (
                  <><RefreshCw className="h-4 w-4 mr-2" /> Sync Now</>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Portfolio Cache Sync */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Portfolio Cache</CardTitle>
                  <CardDescription>Sync portfolio listings and pre-render project pages from Notion</CardDescription>
                </div>
              </div>
              <Button onClick={handleSyncPortfolioCache} disabled={isSyncingPortfolio}>
                {isSyncingPortfolio ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Syncing…</>
                ) : (
                  <><RefreshCw className="h-4 w-4 mr-2" /> Sync Now</>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adminSections.map((section) => (
            <Card 
              key={section.title} 
              className="transition-all hover:shadow-lg cursor-pointer hover:border-primary"
            >
              <Link to={section.href}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{section.description}</CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
