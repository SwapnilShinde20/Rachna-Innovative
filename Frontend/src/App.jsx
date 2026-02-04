import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Purchase from "./pages/buyer/Purchase.jsx";
import PropertyDetails from "./pages/buyer/PropertyDetails";
import Service from "./pages/buyer/Service";
import Blog from "./pages/buyer/Blog";
import BlogDetail from "./pages/buyer/BlogDetails";
import HelpCenter from "./pages/buyer/HelpCenter";
import Favorites from "./pages/buyer/Favorites";
import LoginPage from "./pages/admin/Login/LoginPage.jsx";
import { ProtectedRoute } from "./components/admin/auth/ProtectedRoute.jsx";
import { DashboardLayout } from "./components/admin/dashboard/DashboardLayout";


import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import SellersPage from "./pages/admin/SellersPage";
import UsersPage from "./pages/admin/UsersPage";
import TransactionsPage from "./pages/admin/TransactionsPage";
import ReviewsPage from "./pages/admin/ReviewsPage";
import VideoCallsPage from "./pages/admin/VideoCallsPage";
import MeetingsPage from "./pages/admin/MeetingsPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import CMSPagesPage from "./pages/admin/CMSPagesPage";
import BlogPage from "./pages/admin/BlogPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import PageEditorPage from "./pages/admin/cms/PageEditorPage";
import BlogEditorPage from "./pages/admin/cms/BlogEditorPage";
import CategoriesPage from "./pages/admin/cms/CategoriesPage";
import TagsPage from "./pages/admin/cms/TagsPage";
import MediaPage from "./pages/admin/cms/MediaPage";
import SEOSettingsPage from "./pages/admin/cms/SEOSettingsPage.jsx";
import LegalSupportPage from "./pages/buyer/LegalServices.jsx";
import SecurityPrivacyPage from "./pages/buyer/SecurityPrivacy.jsx";
import CompletedCalls from "./pages/admin/CompletedCalls.jsx";
import CallDetails from "./pages/admin/CallDetail.jsx";

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>


            <Route path="/admin/login" element={<LoginPage />} />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >

              <Route index element={<AdminDashboard />} />
              <Route path="sellers" element={<SellersPage />} />
              <Route path="sellers/:status" element={<SellersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="video-calls" element={<VideoCallsPage />} />
              <Route path="videocalls/completed" element={<CompletedCalls />} />
              <Route path="video-calls/completed/:id" element={<CallDetails />} />
              <Route path="meetings" element={<MeetingsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />

              {/* CMS */}
              <Route path="cms/pages" element={<CMSPagesPage />} />
              <Route path="cms/pages/new" element={<PageEditorPage />} />
              <Route path="cms/pages/:id" element={<PageEditorPage />} />

              <Route path="cms/blogs" element={<BlogPage />} />
              <Route path="cms/blogs/new" element={<BlogEditorPage />} />
              <Route path="cms/blogs/:id" element={<BlogEditorPage />} />

              <Route path="cms/blog-categories" element={<CategoriesPage />} />
              <Route path="cms/blog-tags" element={<TagsPage />} />
              <Route path="cms/media" element={<MediaPage />} />
              <Route path="cms/seo" element={<SEOSettingsPage />} />

              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

          <Route path="/" element={<LandingPage />} />
          <Route path="/buy" element={<Purchase />} />
          <Route path="/buy/:id" element={<PropertyDetails />} />
          <Route path="/rent" element={<Purchase />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/services" element={<Service/>} />
          <Route path="/service/legal-support" element={<LegalSupportPage/>} />
          <Route path="/service/security-privacy" element={<SecurityPrivacyPage/>} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/dashboard" element={< Index/> } />
          <Route path="/dashboard/listings" element={<Index />} />
          <Route path="/dashboard/add" element={<Index />} />
          <Route path="/dashboard/leads" element={<Index />} />
          <Route path="/dashboard/analytics" element={<Index />} />
          <Route path="/dashboard/messages" element={<Index />} />
          <Route path="/dashboard/settings" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
