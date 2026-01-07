import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Search,
  Bell,
  Menu,
} from "lucide-react";
import { SellerSidebar } from "@/components/seller/SellerSidebar";
import { SellerProfileCard } from "@/components/seller/SellerProfileCard";
import { StatsCard } from "@/components/seller/StatsCard";
import { PropertyCard } from "@/components/seller/PropertyCard";
import { LeadsPanel } from "@/components/seller/LeadsPanel";
import { AnalyticsPanel } from "@/components/seller/AnalyticsPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MyListings from "./MyListings";
import AddProperty from "./AddProperty";
import LeadsPage from "./Leads";
import AnalyticsPage from "./Analytics";
import MessagesPage from "./Messages";
import SettingsPage from "./Settings";

const properties = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    title: "Sunset Villa",
    location: "Miami Beach, FL",
    price: "$4,500",
    status: "active",
    beds: 4,
    baths: 3,
    sqft: "2,850",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    title: "Ocean View Apartment",
    location: "Key Biscayne, FL",
    price: "$3,200",
    status: "pending",
    beds: 3,
    baths: 2,
    sqft: "1,950",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    title: "Modern Loft",
    location: "Downtown Miami, FL",
    price: "$2,800",
    status: "sold",
    beds: 2,
    baths: 2,
    sqft: "1,400",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    title: "Garden Estate",
    location: "Coral Gables, FL",
    price: "$5,800",
    status: "active",
    beds: 5,
    baths: 4,
    sqft: "3,500",
  },
];

const routeToTab = {
  "/dashboard": "dashboard",
  "/dashboard/listings": "listings",
  "/dashboard/add": "add",
  "/dashboard/leads": "leads",
  "/dashboard/analytics": "analytics",
  "/dashboard/messages": "messages",
  "/dashboard/settings": "settings",
};

const Index = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(
    routeToTab[location.pathname] || "dashboard"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeItem) {
      case "listings":
        return <MyListings />;
      case "add":
        return <AddProperty />;
      case "leads":
        return <LeadsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "messages":
        return <MessagesPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* PASS THE PROPS HERE */}
      <SellerSidebar
        activeItem={activeItem}
        onItemClick={setActiveItem}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="transition-all duration-300 lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-sm lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold lg:text-xl">
                Dashboard
              </h1>
              <p className="hidden text-sm text-muted-foreground sm:block">
                Welcome back, Pravin!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="w-48 pl-9 lg:w-64"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>

            <Button variant="premium" className="hidden gap-2 sm:flex">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>

            <Button variant="premium" size="icon" className="sm:hidden">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {activeItem === "dashboard" ? (
            <>
              <div className="mb-6">
                <SellerProfileCard />
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Properties" value={24} icon={Building2} />
                <StatsCard title="Active Listings" value={18} icon={TrendingUp} />
                <StatsCard title="Total Leads" value={156} icon={Users} />
                <StatsCard title="Properties Sold" value={42} icon={DollarSign} />
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="mb-4 flex justify-between">
                    <h2 className="text-lg font-semibold">My Listings</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveItem("listings")}
                    >
                      View All
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {properties.map((property, index) => (
                      <PropertyCard
                        key={property.id}
                        {...property}
                        delay={200 + index * 50}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <LeadsPanel />
                  <AnalyticsPanel />
                </div>
              </div>
            </>
          ) : (
            renderContent()
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;