import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CookieConsent } from "./components/CookieConsent";

// Eager-load the homepage for fastest initial render
import Index from "./pages/Index";

// Lazy-load everything else
const AboutPage = lazy(() => import("./pages/AboutPage"));
const HowIWorkPage = lazy(() => import("./pages/HowIWorkPage"));
const StackedSessions = lazy(() => import("./pages/StackedSessions"));
const MentorshipSprint = lazy(() => import("./pages/MentorshipSprint"));
const Workshops = lazy(() => import("./pages/Workshops"));
const FractionalStrategy = lazy(() => import("./pages/FractionalStrategy"));
const DeepEngagement = lazy(() => import("./pages/DeepEngagement"));
const SessionsAndSprints = lazy(() => import("./pages/SessionsAndSprints"));
const FractionalDeepEngagement = lazy(() => import("./pages/FractionalDeepEngagement"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const DataGuarantee = lazy(() => import("./pages/DataGuarantee"));
const CollectivePage = lazy(() => import("./pages/CollectivePage"));
const IndexPhotoHero = lazy(() => import("./pages/IndexPhotoHero"));
const IndexAltHero = lazy(() => import("./pages/IndexAltHero"));
const IndexHorizontal = lazy(() => import("./pages/IndexHorizontal"));
const ThreadMotifDemo = lazy(() => import("./components/ThreadMotifDemo"));
const BrandBook = lazy(() => import("./components/BrandBook"));
const SeoAdminPage = lazy(() => import("./pages/SeoAdminPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));
const ImageLibraryPage = lazy(() => import("./pages/ImageLibraryPage"));
const GeoAdminPage = lazy(() => import("./pages/GeoAdminPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/AdminAnalyticsPage"));
const FictionFavoritesPage = lazy(() => import("./pages/FictionFavoritesPage"));
const CVPage = lazy(() => import("./pages/CVPage"));
const NotionSystemsPage = lazy(() => import("./pages/NotionSystemsPage"));
const RetainerLaunchPage = lazy(() => import("./pages/RetainerLaunchPage"));
const RetainerStartupPage = lazy(() => import("./pages/RetainerStartupPage"));
const RetainerScaleUpPage = lazy(() => import("./pages/RetainerScaleUpPage"));
const WorkWithMePage = lazy(() => import("./pages/WorkWithMePage"));
const CometEffectPage = lazy(() => import("./pages/CometEffectPage"));
const MomentumMapPage = lazy(() => import("./pages/MomentumMapPage"));
const NotionHackathonLondonPage = lazy(() => import("./pages/NotionHackathonLondonPage"));
const NotionDevotionBrightonPage = lazy(() => import("./pages/NotionDevotionBrightonPage"));
const GGFProposalPage = lazy(() => import("./pages/proposal/GGFProposalPage"));
const ArcCollectiveProposalPage = lazy(() => import("./pages/proposal/ArcCollectiveProposalPage"));
const NotionMasterclassPage = lazy(() => import("./pages/NotionMasterclassPage"));
const CreativePortfolioPage = lazy(() => import("./pages/CreativePortfolioPage"));
const NotionPortfolioPage = lazy(() => import("./pages/NotionPortfolioPage"));
const PortfolioAccessAdminPage = lazy(() => import("./pages/PortfolioAccessAdminPage"));
const NotionUtopiaPage = lazy(() => import("./pages/onboarding/NotionUtopiaPage"));
const CharityMeetupApril26Page = lazy(() => import("./pages/CharityMeetupApril26Page"));
const PowerHourThankYouPage = lazy(() => import("./pages/PowerHourThankYouPage"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-i-work" element={<HowIWorkPage />} />
            <Route path="/sessions-and-sprints" element={<SessionsAndSprints />} />
            <Route path="/narratives-strategy" element={<FractionalDeepEngagement />} />
            <Route path="/fractional-deep-engagement" element={<FractionalDeepEngagement />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/notion-systems" element={<NotionSystemsPage />} />
            {/* Legacy routes - redirect to new combined pages */}
            <Route path="/clarity-sessions" element={<SessionsAndSprints />} />
            <Route path="/mentorship-sprint" element={<SessionsAndSprints />} />
            <Route path="/fractional-strategy" element={<FractionalDeepEngagement />} />
            <Route path="/deep-engagement" element={<FractionalDeepEngagement />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/data-guarantee" element={<DataGuarantee />} />
            <Route path="/collective" element={<CollectivePage />} />
            <Route path="/thread-demo" element={<ThreadMotifDemo />} />
            <Route path="/brand-book" element={<BrandBook />} />
            <Route path="/v/photo-hero" element={<IndexPhotoHero />} />
            <Route path="/v/alt-hero" element={<IndexAltHero />} />
            <Route path="/v/horizontal" element={<IndexHorizontal />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/seo" element={<SeoAdminPage />} />
            <Route path="/admin/images" element={<ImageLibraryPage />} />
            <Route path="/admin/geo" element={<GeoAdminPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/portfolio-access" element={<PortfolioAccessAdminPage />} />
            <Route path="/favourite-fiction" element={<FictionFavoritesPage />} />
            <Route path="/private/brendan-rodgers-cv" element={<CVPage />} />
            <Route path="/retainer/launch" element={<RetainerLaunchPage />} />
            <Route path="/retainer/startup" element={<RetainerStartupPage />} />
            <Route path="/retainer/scaleup" element={<RetainerScaleUpPage />} />
            <Route path="/fiction-favorites" element={<Navigate to="/favourite-fiction" replace />} />
            <Route path="/work-with-me" element={<WorkWithMePage />} />
            <Route path="/comet-effect" element={<CometEffectPage />} />
            <Route path="/momentum-map" element={<MomentumMapPage />} />
            <Route path="/notion-hackathon-london" element={<NotionHackathonLondonPage />} />
            <Route path="/notion-devotion-brighton" element={<NotionDevotionBrightonPage />} />
            <Route path="/proposal/GGF" element={<GGFProposalPage />} />
            <Route path="/proposal/arc-collective" element={<ArcCollectiveProposalPage />} />
            <Route path="/notion-masterclass" element={<NotionMasterclassPage />} />
            <Route path="/portfolio/creative" element={<CreativePortfolioPage />} />
            <Route path="/portfolio/creative/:itemId" element={<CreativePortfolioPage />} />
            <Route path="/portfolio/notion" element={<NotionPortfolioPage />} />
            <Route path="/portfolio/notion/:itemId" element={<NotionPortfolioPage />} />
            <Route path="/onboarding/notionutopia" element={<NotionUtopiaPage />} />
            <Route path="/Charity-Meetup-April26" element={<CharityMeetupApril26Page />} />
            <Route path="/charity-meetup-april26" element={<CharityMeetupApril26Page />} />
            <Route path="/power-hour/thank-you" element={<PowerHourThankYouPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
