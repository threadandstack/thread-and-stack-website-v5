import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  LogOut, 
  Loader2, 
  Bot, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileJson,
  Type,
  Link2,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  Sparkles
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// GEO optimization factors checklist
const GEO_FACTORS = {
  structuredData: {
    label: "Structured Data",
    icon: FileJson,
    description: "JSON-LD schema markup for rich AI understanding",
    checks: [
      { id: "hasJsonLd", label: "Has JSON-LD schema", weight: 3 },
      { id: "hasOrgSchema", label: "Organization schema", weight: 2 },
      { id: "hasArticleSchema", label: "Article/BlogPost schema (for blog)", weight: 2 },
      { id: "hasFaqSchema", label: "FAQ schema", weight: 2 },
      { id: "hasBreadcrumbs", label: "Breadcrumb schema", weight: 1 },
    ],
  },
  contentClarity: {
    label: "Content Clarity",
    icon: Type,
    description: "Headers, summaries, and structure that LLMs can parse",
    checks: [
      { id: "hasH1", label: "Single, clear H1 heading", weight: 3 },
      { id: "hasMetaDesc", label: "Meta description present", weight: 2 },
      { id: "hasSummary", label: "Page summary/intro paragraph", weight: 2 },
      { id: "hasSubheadings", label: "Logical subheading hierarchy", weight: 2 },
      { id: "hasFaq", label: "FAQ section with Q&A format", weight: 2 },
      { id: "hasLists", label: "Bulleted/numbered lists", weight: 1 },
    ],
  },
  citations: {
    label: "Citations & Sources",
    icon: Link2,
    description: "Attribution that builds AI trust signals",
    checks: [
      { id: "hasAuthor", label: "Author attribution", weight: 2 },
      { id: "hasDatePublished", label: "Publication date", weight: 2 },
      { id: "hasExternalLinks", label: "Citations to authoritative sources", weight: 2 },
      { id: "hasInternalLinks", label: "Internal linking structure", weight: 1 },
    ],
  },
  aiAccessibility: {
    label: "AI Accessibility",
    icon: Bot,
    description: "Technical factors for AI crawler access",
    checks: [
      { id: "robotsAllowAi", label: "robots.txt allows AI crawlers", weight: 3 },
      { id: "hasCanonical", label: "Canonical URL set", weight: 2 },
      { id: "fastLoadTime", label: "Fast page load time", weight: 1 },
      { id: "mobileOptimized", label: "Mobile-optimized", weight: 1 },
    ],
  },
};

type GeoCheckResult = {
  [key: string]: boolean | null;
};

type PageGeoData = {
  path: string;
  label: string;
  type: "site" | "blog";
  checks: GeoCheckResult;
  score: number;
  maxScore: number;
  lastChecked: string | null;
  aiTestResult?: string;
};

// Site pages to track
const SITE_PAGES = [
  { path: "/", label: "Home", type: "site" as const },
  { path: "/about", label: "About", type: "site" as const },
  { path: "/how-i-work", label: "How I Work", type: "site" as const },
  { path: "/sessions-and-sprints", label: "Sessions & Sprints", type: "site" as const },
  { path: "/fractional-deep-engagement", label: "Fractional Deep Engagement", type: "site" as const },
  { path: "/workshops", label: "Workshops", type: "site" as const },
  { path: "/blog", label: "Blog", type: "site" as const },
];

const GeoAdminPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, signOut } = useAdminAuth();
  const [pages, setPages] = useState<PageGeoData[]>([]);
  const [blogPosts, setBlogPosts] = useState<{ slug: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "site" | "blog" | "optimized" | "needs-work">("all");
  const [testingPage, setTestingPage] = useState<string | null>(null);
  const [aiTestDialog, setAiTestDialog] = useState<{ open: boolean; page: PageGeoData | null }>({ open: false, page: null });
  const [scanningAll, setScanningAll] = useState(false);
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    } else if (!authLoading && user && !isAdmin) {
      toast.error("You don't have admin access");
      signOut();
      navigate("/admin/login");
    }
  }, [authLoading, user, isAdmin, navigate, signOut]);

  useEffect(() => {
    if (isAdmin) {
      fetchBlogPosts();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (blogPosts.length > 0 || !loading) {
      initializePages();
    }
  }, [blogPosts]);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-blog-posts`
      );
      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    }
    setLoading(false);
  };

  const initializePages = () => {
    // Calculate max possible score
    const maxScore = Object.values(GEO_FACTORS).reduce(
      (sum, factor) => sum + factor.checks.reduce((s, c) => s + c.weight, 0),
      0
    );

    const allPages: PageGeoData[] = [
      ...SITE_PAGES.map((page) => ({
        path: page.path,
        label: page.label,
        type: page.type,
        checks: {},
        score: 0,
        maxScore,
        lastChecked: null,
      })),
      ...blogPosts.map((post) => ({
        path: `/blog/${post.slug}`,
        label: post.title,
        type: "blog" as const,
        checks: {},
        score: 0,
        maxScore,
        lastChecked: null,
      })),
    ];

    // Load saved data from localStorage
    const saved = localStorage.getItem("geo-tracking-data");
    if (saved) {
      const savedData = JSON.parse(saved) as Record<string, Partial<PageGeoData>>;
      allPages.forEach((page) => {
        if (savedData[page.path]) {
          page.checks = savedData[page.path].checks || {};
          page.score = savedData[page.path].score || 0;
          page.lastChecked = savedData[page.path].lastChecked || null;
          page.aiTestResult = savedData[page.path].aiTestResult;
        }
      });
    }

    setPages(allPages);
  };

  const savePageData = (updatedPages: PageGeoData[]) => {
    const dataToSave = updatedPages.reduce((acc, page) => {
      acc[page.path] = {
        checks: page.checks,
        score: page.score,
        lastChecked: page.lastChecked,
        aiTestResult: page.aiTestResult,
      };
      return acc;
    }, {} as Record<string, Partial<PageGeoData>>);
    localStorage.setItem("geo-tracking-data", JSON.stringify(dataToSave));
  };

  const toggleCheck = (pagePath: string, checkId: string) => {
    setPages((prev) => {
      const updated = prev.map((page) => {
        if (page.path !== pagePath) return page;
        
        const newChecks = { ...page.checks };
        // Cycle: null -> true -> false -> null
        if (newChecks[checkId] === null || newChecks[checkId] === undefined) {
          newChecks[checkId] = true;
        } else if (newChecks[checkId] === true) {
          newChecks[checkId] = false;
        } else {
          newChecks[checkId] = null;
        }

        // Recalculate score
        let score = 0;
        Object.values(GEO_FACTORS).forEach((factor) => {
          factor.checks.forEach((check) => {
            if (newChecks[check.id] === true) {
              score += check.weight;
            }
          });
        });

        return {
          ...page,
          checks: newChecks,
          score,
          lastChecked: new Date().toISOString(),
        };
      });
      
      savePageData(updated);
      return updated;
    });
  };

  const scanPage = async (page: PageGeoData): Promise<PageGeoData | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("geo-scan-page", {
        body: { url: `${window.location.origin}${page.path}` },
      });

      if (error) throw error;

      return {
        ...page,
        checks: data.checks,
        score: data.score,
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Scan error for", page.path, error);
      return null;
    }
  };

  const scanAllPages = async () => {
    setScanningAll(true);
    setScanProgress({ current: 0, total: pages.length });
    
    const updatedPages = [...pages];
    
    for (let i = 0; i < pages.length; i++) {
      setScanProgress({ current: i + 1, total: pages.length });
      const scanned = await scanPage(pages[i]);
      if (scanned) {
        updatedPages[i] = scanned;
      }
      // Small delay to avoid overwhelming the server
      await new Promise(r => setTimeout(r, 300));
    }
    
    setPages(updatedPages);
    savePageData(updatedPages);
    setScanningAll(false);
    toast.success(`Scanned ${pages.length} pages`);
  };

  const scanSinglePage = async (page: PageGeoData) => {
    setTestingPage(page.path);
    const scanned = await scanPage(page);
    if (scanned) {
      setPages((prev) => {
        const updated = prev.map((p) => p.path === page.path ? scanned : p);
        savePageData(updated);
        return updated;
      });
      toast.success(`Scanned ${page.label}`);
    } else {
      toast.error("Failed to scan page");
    }
    setTestingPage(null);
  };

  const runAiTest = async (page: PageGeoData) => {
    setTestingPage(page.path);
    
    try {
      const { data, error } = await supabase.functions.invoke("geo-ai-test", {
        body: { 
          url: `${window.location.origin}${page.path}`,
          pageTitle: page.label 
        },
      });

      if (error) {
        throw error;
      }

      setPages((prev) => {
        const updated = prev.map((p) => {
          if (p.path !== page.path) return p;
          return {
            ...p,
            aiTestResult: data.analysis,
            lastChecked: new Date().toISOString(),
          };
        });
        savePageData(updated);
        return updated;
      });

      setAiTestDialog({ open: true, page: { ...page, aiTestResult: data.analysis } });
      toast.success("AI analysis complete");
    } catch (error) {
      console.error("AI test error:", error);
      toast.error("Failed to run AI test. Make sure the edge function is deployed.");
    } finally {
      setTestingPage(null);
    }
  };

  const hasBeenChecked = (page: PageGeoData) => {
    return Object.keys(page.checks).length > 0;
  };

  const getScoreColor = (score: number, max: number, checked: boolean) => {
    if (!checked) return "text-muted-foreground";
    const percentage = (score / max) * 100;
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number, max: number, checked: boolean) => {
    if (!checked) return "bg-muted text-muted-foreground";
    const percentage = (score / max) * 100;
    if (percentage >= 75) return "bg-green-100 text-green-800";
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const filteredPages = pages.filter((page) => {
    if (filterType === "all") return true;
    if (filterType === "site") return page.type === "site";
    if (filterType === "blog") return page.type === "blog";
    if (filterType === "optimized") return (page.score / page.maxScore) >= 0.75;
    if (filterType === "needs-work") return (page.score / page.maxScore) < 0.5;
    return true;
  });

  const checkedPages = pages.filter(p => hasBeenChecked(p));
  const overallScore = checkedPages.reduce((sum, p) => sum + p.score, 0);
  const overallMax = checkedPages.reduce((sum, p) => sum + p.maxScore, 0);
  const overallPercentage = overallMax > 0 ? Math.round((overallScore / overallMax) * 100) : 0;
  const anyChecked = checkedPages.length > 0;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/seo">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-7 w-7 text-primary" />
                GEO Optimization Tracker
              </h1>
              <p className="text-muted-foreground">
                Track & optimize pages for AI/LLM search engines
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Overall GEO Score</h3>
                <p className="text-sm text-muted-foreground">
                  {anyChecked 
                    ? `${checkedPages.length} of ${pages.length} pages scanned`
                    : `${pages.length} pages ready to scan`
                  }
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={scanAllPages}
                  disabled={scanningAll}
                  className="gap-2"
                >
                  {scanningAll ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Scanning {scanProgress.current}/{scanProgress.total}...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Scan All Pages
                    </>
                  )}
                </Button>
                <div className={`text-4xl font-bold ${getScoreColor(overallScore, overallMax, anyChecked)}`}>
                  {anyChecked ? `${overallPercentage}%` : "—"}
                </div>
              </div>
            </div>
            <Progress value={scanningAll ? (scanProgress.current / scanProgress.total) * 100 : overallPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* GEO Factors Legend */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">GEO Optimization Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(GEO_FACTORS).map(([key, factor]) => (
                <div key={key} className="flex items-start gap-2">
                  <factor.icon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{factor.label}</p>
                    <p className="text-xs text-muted-foreground">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "all", label: "All Pages" },
            { key: "site", label: "Site Pages" },
            { key: "blog", label: "Blog Posts" },
            { key: "optimized", label: "Optimized (75%+)" },
            { key: "needs-work", label: "Needs Work (<50%)" },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filterType === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(tab.key as typeof filterType)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Pages List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {filteredPages.map((page) => {
              const checked = hasBeenChecked(page);
              const percentage = Math.round((page.score / page.maxScore) * 100);
              
              return (
                <AccordionItem key={page.path} value={page.path} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Score badge */}
                      <Badge className={`${getScoreBadge(page.score, page.maxScore, checked)} min-w-[48px] justify-center`}>
                        {checked ? `${percentage}%` : "—"}
                      </Badge>
                      
                      {/* Page info */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{page.label}</span>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{page.path}</code>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${page.type === "blog" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                            {page.type}
                          </span>
                        </div>
                        {page.lastChecked && (
                          <p className="text-xs text-muted-foreground">
                            Last updated: {new Date(page.lastChecked).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* AI Test indicator */}
                      {page.aiTestResult && (
                        <Badge variant="outline" className="gap-1">
                          <Bot className="h-3 w-3" />
                          AI Tested
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      {/* Action buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => scanSinglePage(page)}
                          disabled={testingPage === page.path || scanningAll}
                        >
                          {testingPage === page.path ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4 mr-2" />
                          )}
                          Scan Page
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => runAiTest(page)}
                          disabled={testingPage === page.path || scanningAll}
                        >
                          {testingPage === page.path ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Bot className="h-4 w-4 mr-2" />
                          )}
                          Deep AI Analysis
                        </Button>
                        {page.aiTestResult && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAiTestDialog({ open: true, page })}
                          >
                            View AI Analysis
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a href={page.path} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Page
                          </a>
                        </Button>
                      </div>

                      {/* Checklist grid */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(GEO_FACTORS).map(([factorKey, factor]) => (
                          <Card key={factorKey} className="bg-muted/30">
                            <CardHeader className="pb-2 pt-3 px-3">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <factor.icon className="h-4 w-4 text-primary" />
                                {factor.label}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="px-3 pb-3">
                              <div className="space-y-1">
                                {factor.checks.map((check) => {
                                  const status = page.checks[check.id];
                                  return (
                                    <button
                                      key={check.id}
                                      onClick={() => toggleCheck(page.path, check.id)}
                                      className="w-full flex items-center gap-2 text-left text-sm py-1 px-2 rounded hover:bg-muted transition-colors"
                                    >
                                      {status === true ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                      ) : status === false ? (
                                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                      ) : (
                                        <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                      )}
                                      <span className={status === false ? "line-through text-muted-foreground" : ""}>
                                        {check.label}
                                      </span>
                                      <span className="ml-auto text-xs text-muted-foreground">
                                        +{check.weight}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        {/* AI Test Result Dialog */}
        <Dialog open={aiTestDialog.open} onOpenChange={(open) => setAiTestDialog({ open, page: null })}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Analysis: {aiTestDialog.page?.label}
              </DialogTitle>
              <DialogDescription>
                How AI search engines perceive this page
              </DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                {aiTestDialog.page?.aiTestResult || "No analysis available"}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GeoAdminPage;
