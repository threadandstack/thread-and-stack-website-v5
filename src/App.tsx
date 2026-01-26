import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import HowIWorkPage from "./pages/HowIWorkPage";
import StackedSessions from "./pages/StackedSessions";
import MentorshipSprint from "./pages/MentorshipSprint";
import Workshops from "./pages/Workshops";
import FractionalStrategy from "./pages/FractionalStrategy";
import DeepEngagement from "./pages/DeepEngagement";
import SessionsAndSprints from "./pages/SessionsAndSprints";
import FractionalDeepEngagement from "./pages/FractionalDeepEngagement";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DataGuarantee from "./pages/DataGuarantee";
import CollectivePage from "./pages/CollectivePage";
import IndexPhotoHero from "./pages/IndexPhotoHero";
import ThreadMotifDemo from "./components/ThreadMotifDemo";
import BrandBook from "./components/BrandBook";
import SeoAdminPage from "./pages/SeoAdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminResetPassword from "./pages/AdminResetPassword";
import ImageLibraryPage from "./pages/ImageLibraryPage";
import GeoAdminPage from "./pages/GeoAdminPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import FictionFavoritesPage from "./pages/FictionFavoritesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-i-work" element={<HowIWorkPage />} />
          <Route path="/sessions-and-sprints" element={<SessionsAndSprints />} />
          <Route path="/fractional-deep-engagement" element={<FractionalDeepEngagement />} />
          <Route path="/workshops" element={<Workshops />} />
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
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/seo" element={<SeoAdminPage />} />
          <Route path="/admin/images" element={<ImageLibraryPage />} />
          <Route path="/admin/geo" element={<GeoAdminPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/favourite-fiction" element={<FictionFavoritesPage />} />
          {/* Legacy route - redirect to new URL */}
          <Route path="/fiction-favorites" element={<FictionFavoritesPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
