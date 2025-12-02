import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import StackedSessions from "./pages/StackedSessions";
import MentorshipSprint from "./pages/MentorshipSprint";
import Workshops from "./pages/Workshops";
import FractionalStrategy from "./pages/FractionalStrategy";
import DeepEngagement from "./pages/DeepEngagement";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DataGuarantee from "./pages/DataGuarantee";

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
          <Route path="/clarity-sessions" element={<StackedSessions />} />
          <Route path="/mentorship-sprint" element={<MentorshipSprint />} />
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/fractional-strategy" element={<FractionalStrategy />} />
          <Route path="/deep-engagement" element={<DeepEngagement />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/data-guarantee" element={<DataGuarantee />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
