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

const queryClient = new QueryClient();
const role = "buyer";
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/buy" element={<Purchase />} />
          <Route path="/buy/:id" element={<PropertyDetails />} />
          <Route path="/rent" element={<Purchase />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/services/:value" element={<Service/>} />
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
