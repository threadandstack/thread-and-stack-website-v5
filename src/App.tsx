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
const NarrativesStrategyServicesPage = lazy(() => import("./pages/NarrativesStrategyServicesPage"));
const DeepEngagement = lazy(() => import("./pages/DeepEngagement"));
const SessionsAndSprints = lazy(() => import("./pages/SessionsAndSprints"));
const FractionalDeepEngagement = lazy(() => import("./pages/FractionalDeepEngagement"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const HomePageDraft = lazy(() => import("./pages/HomePageDraft"));
const HomePageDraft2 = lazy(() => import("./pages/HomePageDraft2"));
const ScorecardPage = lazy(() => import("./pages/ScorecardPage"));
const HowIWorkDraft2Page = lazy(() => import("./pages/HowIWorkDraft2Page"));
const JournalDraft2Page = lazy(() => import("./pages/JournalDraft2Page"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const DataGuarantee = lazy(() => import("./pages/DataGuarantee"));
const CollectivePage = lazy(() => import("./pages/CollectivePage"));



const IndexPickALane = lazy(() => import("./pages/IndexPickALane"));
const ThreadMotifDemo = lazy(() => import("./components/ThreadMotifDemo"));
const BrandBook = lazy(() => import("./components/BrandBook"));
const SeoAdminPage = lazy(() => import("./pages/SeoAdminPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));
const ImageLibraryPage = lazy(() => import("./pages/ImageLibraryPage"));
const GeoAdminPage = lazy(() => import("./pages/GeoAdminPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/AdminAnalyticsPage"));

const CVPage = lazy(() => import("./pages/CVPage"));
const NotionSystemsPage = lazy(() => import("./pages/NotionSystemsPage"));
const RetainerLaunchPage = lazy(() => import("./pages/RetainerLaunchPage"));
const RetainerStartupPage = lazy(() => import("./pages/RetainerStartupPage"));
const RetainerScaleUpPage = lazy(() => import("./pages/RetainerScaleUpPage"));
const WorkWithMePage = lazy(() => import("./pages/WorkWithMePage"));
const CometEffectPage = lazy(() => import("./pages/CometEffectPage"));
const MomentumMapPage = lazy(() => import("./pages/MomentumMapPage"));
const NotionHackathonLondonPage = lazy(() => import("./pages/NotionHackathonLondonPage"));
const NotionHackathonLondonV2Page = lazy(() => import("./pages/NotionHackathonLondonV2Page"));
const NotionDevotionBrightonPage = lazy(() => import("./pages/NotionDevotionBrightonPage"));
const GGFProposalPage = lazy(() => import("./pages/proposal/GGFProposalPage"));
const ArcCollectiveProposalPage = lazy(() => import("./pages/proposal/ArcCollectiveProposalPage"));
const StrategyServicesPage = lazy(() => import("./pages/proposal/StrategyServicesPage"));
const AiOpsServicesPage = lazy(() => import("./pages/proposal/AiOpsServicesPage"));
const LSSProposalPage = lazy(() => import("./pages/proposal/LSSProposalPage"));
const SFFireProposalPage = lazy(() => import("./pages/proposal/SFFireProposalPage"));
const BfBLabsProposalPage = lazy(() => import("./pages/proposal/BfBLabsProposalPage"));
const SummitNetworkProposalPage = lazy(() => import("./pages/proposal/SummitNetworkProposalPage"));
const NotionMasterclassPage = lazy(() => import("./pages/NotionMasterclassPage"));
const CreativePortfolioPage = lazy(() => import("./pages/CreativePortfolioPage"));
const NotionPortfolioPage = lazy(() => import("./pages/NotionPortfolioPage"));
const PortfolioAccessAdminPage = lazy(() => import("./pages/PortfolioAccessAdminPage"));
const NotionUtopiaPage = lazy(() => import("./pages/onboarding/NotionUtopiaPage"));
const CharityMeetupApril26Page = lazy(() => import("./pages/CharityMeetupApril26Page"));
const UnleashYourTeamPage = lazy(() => import("./pages/UnleashYourTeamPage"));
const PowerHourThankYouPage = lazy(() => import("./pages/PowerHourThankYouPage"));
const CoDesignThankYouPage = lazy(() => import("./pages/CoDesignThankYouPage"));
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage"));
const BecomeUnitedBlueprintPage = lazy(() => import("./pages/BecomeUnitedBlueprintPage"));
const UnleashYourTeamDraft2Page = lazy(() => import("./pages/UnleashYourTeamDraft2Page"));
const IntroCallPage = lazy(() => import("./pages/IntroCallPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));


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
            {/* New official homepage (formerly home-draft2) */}
            <Route path="/" element={<HomePageDraft2 />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-i-work" element={<HowIWorkDraft2Page />} />
            <Route path="/services" element={<ServicesPage />} />
            {/* Depreciated service pages — redirect to the new unified /services */}
            <Route path="/sessions-and-sprints" element={<Navigate to="/services" replace />} />
            <Route path="/narratives-strategy" element={<Navigate to="/services" replace />} />
            <Route path="/narratives-and-strategy-services" element={<NarrativesStrategyServicesPage />} />
            <Route path="/fractional-deep-engagement" element={<Navigate to="/services" replace />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/notion-systems" element={<Navigate to="/services" replace />} />
            {/* Originals kept under /depreciate for reference */}
            <Route path="/depreciate/narratives-strategy" element={<FractionalDeepEngagement />} />
            <Route path="/depreciate/notion-systems" element={<NotionSystemsPage />} />
            <Route path="/depreciate/sessions-and-sprints" element={<SessionsAndSprints />} />
            {/* Legacy routes - redirect to new combined pages */}
            <Route path="/clarity-sessions" element={<Navigate to="/services" replace />} />
            <Route path="/mentorship-sprint" element={<Navigate to="/services" replace />} />
            <Route path="/fractional-strategy" element={<Navigate to="/services" replace />} />
            <Route path="/deep-engagement" element={<Navigate to="/services" replace />} />

            <Route path="/blog" element={<BlogPage />} />
            <Route path="/home-draft" element={<HomePageDraft />} />
            {/* Backward-compat redirects for old draft2 paths */}
            <Route path="/home-draft2" element={<Navigate to="/" replace />} />
            <Route path="/home-draft2/how-i-work" element={<Navigate to="/how-i-work" replace />} />
            <Route path="/home-draft2/scorecard" element={<Navigate to="/scorecard" replace />} />
            <Route path="/home-draft2/journal" element={<JournalDraft2Page />} />
            {/* Depreciated originals — kept available for reference */}
            <Route path="/depreciate/home" element={<Index />} />
            <Route path="/depreciate/how-i-work" element={<HowIWorkPage />} />
            <Route path="/scorecard" element={<ScorecardPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/data-guarantee" element={<DataGuarantee />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            <Route path="/collective" element={<CollectivePage />} />
            <Route path="/thread-demo" element={<ThreadMotifDemo />} />
            <Route path="/brand-book" element={<BrandBook />} />
            
            
            
            <Route path="/v/pick-a-lane" element={<IndexPickALane />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/seo" element={<SeoAdminPage />} />
            <Route path="/admin/images" element={<ImageLibraryPage />} />
            <Route path="/admin/geo" element={<GeoAdminPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/portfolio-access" element={<PortfolioAccessAdminPage />} />
            <Route path="/favourite-fiction" element={<Navigate to="/" replace />} />
            <Route path="/private/brendan-rodgers-cv" element={<CVPage />} />
            <Route path="/retainer/launch" element={<RetainerLaunchPage />} />
            <Route path="/retainer/startup" element={<RetainerStartupPage />} />
            <Route path="/retainer/scaleup" element={<RetainerScaleUpPage />} />
            <Route path="/fiction-favorites" element={<Navigate to="/" replace />} />
            <Route path="/work-with-me" element={<WorkWithMePage />} />
            <Route path="/comet-effect" element={<CometEffectPage />} />
            <Route path="/momentum-map" element={<MomentumMapPage />} />
            <Route path="/notion-hackathon-london" element={<NotionHackathonLondonPage />} />
            <Route path="/notion-hackathon-london/v2" element={<NotionHackathonLondonV2Page />} />
            <Route path="/notion-devotion-brighton" element={<NotionDevotionBrightonPage />} />
            <Route path="/proposal/GGF" element={<GGFProposalPage />} />
            <Route path="/proposal/arc-collective" element={<ArcCollectiveProposalPage />} />
            <Route path="/proposal/services-strategy" element={<StrategyServicesPage />} />
            <Route path="/proposal/services-ai-ops" element={<AiOpsServicesPage />} />
            <Route path="/proposal/lss" element={<LSSProposalPage />} />
            <Route path="/proposal/sf-fire" element={<SFFireProposalPage />} />
            <Route path="/proposal/bfb-labs" element={<BfBLabsProposalPage />} />
            <Route path="/notion-masterclass" element={<NotionMasterclassPage />} />
            <Route path="/portfolio/creative" element={<CreativePortfolioPage />} />
            <Route path="/portfolio/creative/:itemId" element={<CreativePortfolioPage />} />
            <Route path="/portfolio/notion" element={<NotionPortfolioPage />} />
            <Route path="/portfolio/notion/:itemId" element={<NotionPortfolioPage />} />
            <Route path="/onboarding/notionutopia" element={<NotionUtopiaPage />} />
            <Route path="/Charity-Meetup-April26" element={<CharityMeetupApril26Page />} />
            <Route path="/charity-meetup-april26" element={<CharityMeetupApril26Page />} />
            <Route path="/Unleash-Your-Team" element={<UnleashYourTeamPage />} />
            <Route path="/unleash-your-team" element={<UnleashYourTeamPage />} />
            <Route path="/power-hour/thank-you" element={<PowerHourThankYouPage />} />
            <Route path="/co-design/thank-you" element={<CoDesignThankYouPage />} />
            <Route path="/blueprint/become-united" element={<BecomeUnitedBlueprintPage />} />
            <Route path="/Unleash-Your-Team/draft2" element={<UnleashYourTeamDraft2Page />} />
            <Route path="/unleash-your-team/draft2" element={<UnleashYourTeamDraft2Page />} />
            <Route path="/Unleash-Your-Team/v2" element={<UnleashYourTeamDraft2Page />} />
            <Route path="/unleash-your-team/v2" element={<UnleashYourTeamDraft2Page />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/intro-call" element={<IntroCallPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
