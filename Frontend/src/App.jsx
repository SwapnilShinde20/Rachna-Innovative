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
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import Profile from "./pages/buyer/Profile";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/admin/Login/LoginPage.jsx";
           
import { ProtectedRoute } from "./components/admin/auth/ProtectedRoute.jsx";
import { DashboardLayout } from "./components/admin/dashboard/DashboardLayout";


import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import SellersPage from "./pages/admin/SellersPage";
import UsersPage from "./pages/admin/UsersPage";
import TransactionsPage from "./pages/admin/TransactionsPage";
import CompleteProfile from "./pages/Seller/CompleteProfile";
import ReviewsPage from "./pages/admin/ReviewsPage";
import VideoCallsPage from "./pages/admin/VideoCallsPage";
import MeetingsPage from "./pages/admin/MeetingsPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import CMSPagesPage from "./pages/admin/CMSPagesPage";
import BlogPage from "./pages/admin/BlogPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import ServiceRequestsPage from "./pages/admin/ServiceRequestsPage";
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
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const AuthInitializer = ({ children }) => {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthInitializer>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>


            <Route path="/login" element={<AuthPage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]} redirectTo="/admin/login">
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
              <Route path="videocalls/completed/:id" element={<CallDetails />} />
              <Route path="meetings" element={<MeetingsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="service-requests" element={<ServiceRequestsPage />} />

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
          
          {/* Protected Buyer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']} redirectTo="/login" />}>
             <Route path="/buy" element={<Purchase />} />
             <Route path="/buy/:id" element={<PropertyDetails />} />
             <Route path="/favorites" element={<Favorites />} />
             <Route path="/buyerdashboard" element={<BuyerDashboard />} />
             <Route path="/profile" element={<Profile />} />
             <Route path="/help" element={<HelpCenter />} />
             <Route path="/services" element={<Service/>} />
             <Route path="/service/legal-support" element={<LegalSupportPage/>} />
             <Route path="/service/security-privacy" element={<SecurityPrivacyPage/>} />
             <Route path="/blogs" element={<Blog />} />
             <Route path="/blog/:id" element={<BlogDetail />} />
          </Route>

          {/* Protected Seller Routes */}
          <Route element={<ProtectedRoute allowedRoles={['seller', 'admin']} redirectTo="/login" />}>
             <Route path="/complete-profile" element={<CompleteProfile />} />
             <Route path="/dashboard" element={< Index/> } />
             <Route path="/dashboard/listings" element={<Index />} />
             <Route path="/dashboard/add" element={<Index />} />
             <Route path="/dashboard/leads" element={<Index />} />
             <Route path="/dashboard/analytics" element={<Index />} />
             <Route path="/dashboard/messages" element={<Index />} />
             <Route path="/dashboard/settings" element={<Index />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthInitializer>
  </QueryClientProvider>
);

export default App;
