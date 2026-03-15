import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { useLocation } from "react-router-dom";
import { format } from 'date-fns';
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Search,
  Bell,
  Menu,
  Briefcase,
  FileText,
  Plus,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { SellerSidebar } from "@/components/seller/SellerSidebar";
import { SellerProfileCard } from "@/components/seller/SellerProfileCard";
import { StatsCard } from "@/components/seller/StatsCard";
import { PropertyCard } from "@/components/seller/PropertyCard";
import { AnalyticsPanel } from "@/components/seller/AnalyticsPanel";
import { NotificationDropdown } from "@/components/ui/NotificationDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MyListings from "./Seller/MyListings";
import AddProperty from "./Seller/AddProperty";
import LeadsPage from "./Seller/Leads";
import AnalyticsPage from "./Seller/Analytics";
import VideoCallsPage from "./Seller/VideoCalls";
import SettingsPage from "./Seller/Settings";

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
  "/dashboard/video-calls": "video-calls",
  "/dashboard/settings": "settings",
};

const Index = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(
    routeToTab[location.pathname] || "dashboard"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddPropertyClick = () => {
    if (seller?.status !== 'approved') return;
    setEditingProperty(null);
    setActiveItem("add");
  };

  const handleEditPropertyClick = (property) => {
    if (seller?.status !== 'approved') return;
    setEditingProperty(property);
    setActiveItem("add");
  };

  // Fetch Current Seller
  const { data: seller } = useQuery({
      queryKey: ['seller', 'me'],
      queryFn: async () => {
          const { data } = await api.get('/sellers/me');
          return data;
      },
      retry: false
  });

  const isApproved = seller?.status === 'approved';

  // Fetch Seller Properties
  const { data: properties = [] } = useQuery({
       queryKey: ['properties', 'seller', seller?._id],
       queryFn: async () => {
           const { data } = await api.get(`/properties?sellerId=${seller._id}`);
           return data.map(p => ({
               id: p._id,
               image: p.images && p.images[0] ? p.images[0] : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
               title: p.title,
               location: [p.location, p.city].filter(Boolean).join(', '),
               price: `₹${p.price?.toLocaleString() || 0}`,
               status: p.status === 'pending_review' ? 'pending' : p.status,
               beds: p.bedrooms,
               baths: p.bathrooms,
               sqft: p.area,
               rawData: p,
           }));
       },
       enabled: !!seller?._id
  });

  // Fetch Seller Service Requests
  const { data: serviceRequests = [] } = useQuery({
    queryKey: ['seller-service-requests'],
    queryFn: async () => {
      const { data } = await api.get('/service-requests');
      return data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (propertyId) => {
      await api.delete(`/properties/${propertyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({ title: "Property deleted successfully" });
      setPropertyToDelete(null);
    },
    onError: () => {
      toast({ title: "Failed to delete property", variant: "destructive" });
      setPropertyToDelete(null);
    }
  });

  const confirmDelete = (propertyId) => {
    setPropertyToDelete(propertyId);
  };

  const getServiceStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>;
      case 'In Progress':
        return <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>;
      case 'Resolved':
        return <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>;
      case 'Rejected':
        return <span className="bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-500 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case "listings":
        return <MyListings onAddProperty={handleAddPropertyClick} onEditProperty={handleEditPropertyClick} />;
      case "add":
        return <AddProperty onSuccess={() => setActiveItem("listings")} editProperty={editingProperty} />;
      case "leads":
        return <LeadsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "video-calls":
        return <VideoCallsPage />;
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
                Welcome back, {useAuthStore.getState().user?.name || 'Seller'}!
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

            {seller?._id && <NotificationDropdown userId={seller._id} />}

            <Button variant="premium" className="hidden gap-2 sm:flex" onClick={handleAddPropertyClick}
              disabled={!isApproved}
              title={!isApproved ? 'Your account must be approved by admin to add properties' : ''}
            >
              <Plus className="h-4 w-4" />
              Add Property
            </Button>

            <Button variant="premium" size="icon" className="sm:hidden" onClick={handleAddPropertyClick}
              disabled={!isApproved}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {activeItem === "dashboard" ? (
            <>
              {/* Pending Approval Notice */}
              {!isApproved && seller && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <ShieldAlert className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-800">Account Pending Approval</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Your seller account is currently under review by our admin team. 
                        Once approved, you'll be able to list properties, manage leads, and access all seller features.
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
                        <Clock className="h-3.5 w-3.5" />
                        Status: <span className="font-semibold capitalize">{seller?.status || 'submitted'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <SellerProfileCard onEditProfile={() => setActiveItem("settings")} />
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Properties" value={properties.length} icon={Building2} />
                <StatsCard title="Active Listings" value={properties.filter(p => p.status === 'active').length} icon={TrendingUp} />
                <StatsCard title="Total Leads" value={0} icon={Users} />
                <StatsCard title="Properties Sold" value={properties.filter(p => p.status === 'sold').length} icon={DollarSign} />
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-3">
                  <div className="mb-4 flex justify-between">
                    <h2 className="text-lg font-semibold">Recent Listings</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveItem("listings")}
                    >
                      View All
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {properties.slice(0, 4).map((property, index) => (
                      <PropertyCard
                        key={property.id}
                        {...property}
                        delay={200 + index * 50}
                        onEdit={() => handleEditPropertyClick(property.rawData)}
                        onDelete={() => confirmDelete(property.id)}
                      />
                    ))}
                  </div>

                  {/* Professional Service Requests */}
                  <div className="mt-8">
                    <div className="mb-4 flex justify-between">
                      <h2 className="text-lg font-semibold">Recent Service Inquiries</h2>
                      {serviceRequests.length > 0 && (
                        <div className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded">
                          {serviceRequests.length} Total
                        </div>
                      )}
                    </div>
                    {serviceRequests.length === 0 ? (
                      <div className="bg-card text-muted-foreground p-6 rounded-lg border text-center text-sm italic">
                        You have no active service inquiries.
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {serviceRequests.slice(0, 3).map(req => (
                          <div key={req._id} className="bg-card p-4 rounded-xl border shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                {req.serviceCategory === 'Legal' ? <Briefcase className="w-4 h-4 text-amber-600"/> : <FileText className="w-4 h-4 text-blue-600"/>}
                                <span className="text-sm font-bold truncate max-w-[150px]">{req.subject}</span>
                              </div>
                              {getServiceStatusBadge(req.status)}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{req.description}</p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/10">
                               <span className="text-[10px] font-medium text-muted-foreground bg-neutral-100 px-1.5 py-0.5 rounded">
                                 {req.serviceCategory}
                               </span>
                               <span className="text-[10px] text-muted-foreground">
                                 {format(new Date(req.createdAt), 'MMM d, yyyy')}
                               </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Delete Confirmation Dialog */}
              <AlertDialog open={!!propertyToDelete} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your property listing
                      from the platform.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        deleteMutation.mutate(propertyToDelete); 
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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