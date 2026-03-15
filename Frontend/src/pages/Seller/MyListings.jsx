import { useState } from "react";
import { Plus, Search, Filter, Grid3X3, List, Eye, MessageSquare, Trash2, AlertCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { PropertyCard } from "@/components/seller/PropertyCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function MyListings({ onAddProperty, onEditProperty }) {
  const [viewMode, setViewMode] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get seller info first
  const { data: seller } = useQuery({
    queryKey: ['seller', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/sellers/me');
      return data;
    },
    retry: false
  });

  // Fetch seller's properties
  const { data: rawProperties = [], isLoading } = useQuery({
    queryKey: ['properties', 'seller', seller?._id],
    queryFn: async () => {
      const { data } = await api.get(`/properties?sellerId=${seller._id}`);
      return data;
    },
    enabled: !!seller?._id,
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

  // Transform data for display
  const allProperties = rawProperties.map(p => ({
    id: p._id,
    image: p.images && p.images[0] ? p.images[0] : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    title: p.title,
    location: [p.location, p.city].filter(Boolean).join(', ') || 'No location',
    price: `₹${p.price?.toLocaleString() || 0}`,
    status: p.status === 'pending_review' ? 'pending' : p.status,
    beds: p.bedrooms,
    baths: p.bathrooms,
    sqft: p.area ? p.area.toLocaleString() : '—',
    views: 0,
    adminRemarks: p.adminRemarks,
    rawStatus: p.status,
    rawData: p,
  }));

  // Filter
  const filteredProperties = allProperties
    .filter(p => statusFilter === "all" || p.status === statusFilter)
    .filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const statusCounts = {
    all: allProperties.length,
    pending: allProperties.filter(p => p.status === 'pending').length,
    approved: allProperties.filter(p => p.status === 'approved').length,
    rejected: allProperties.filter(p => p.status === 'rejected').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Listings</h1>
          <p className="text-sm text-muted-foreground">
            {allProperties.length} properties total
          </p>
        </div>
        <Button variant="premium" className="gap-2" onClick={onAddProperty}>
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search properties..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                <SelectItem value="approved">Approved ({statusCounts.approved})</SelectItem>
                <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-1 rounded-lg border border-border p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12 text-muted-foreground">Loading your properties...</div>
      )}

      {/* Empty State */}
      {!isLoading && allProperties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No properties yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Start by adding your first property listing</p>
            <Button variant="premium" className="gap-2" onClick={onAddProperty}>
              <Plus className="h-4 w-4" />
              Add Your First Property
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Properties */}
      {!isLoading && filteredProperties.length > 0 && (
        viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property, index) => (
              <div
                key={property.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PropertyCard 
                  {...property} 
                  delay={0} 
                  onDelete={() => confirmDelete(property.id)}
                  onEdit={() => onEditProperty(property.rawData)}
                />
                {property.rawStatus === 'rejected' && property.adminRemarks && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-destructive">Admin Feedback</p>
                      <p className="text-muted-foreground">{property.adminRemarks}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProperties.map((property, index) => (
              <Card
                key={property.id}
                className="animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="flex gap-4 p-4">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-24 w-32 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{property.title}</h3>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={property.status}>{property.status}</Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => onEditProperty(property.rawData)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => confirmDelete(property.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {property.beds} Beds • {property.baths} Baths
                        </span>
                      </div>

                      <p className="text-lg font-semibold text-primary">
                        {property.price}
                      </p>
                    </div>

                    {property.rawStatus === 'rejected' && property.adminRemarks && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>{property.adminRemarks}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

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
    </div>
  );
}
