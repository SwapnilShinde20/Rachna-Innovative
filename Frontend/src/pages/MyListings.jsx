import { useState } from "react";
import { Plus, Search, Filter, Grid3X3, List, Eye, MessageSquare } from "lucide-react";
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
import { PropertyCard } from "@/components/seller/PropertyCard";

const allProperties = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    title: "Sunset Villa",
    location: "Miami Beach, FL",
    price: "$4,500",
    status: "active",
    beds: 4,
    baths: 3,
    sqft: "2,850",
    views: 234,
    leads: 12,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    title: "Ocean View Apartment",
    location: "Key Biscayne, FL",
    price: "$3,200",
    status: "pending",
    beds: 3,
    baths: 2,
    sqft: "1,950",
    views: 156,
    leads: 8,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    title: "Modern Loft",
    location: "Downtown Miami, FL",
    price: "$2,800",
    status: "sold",
    beds: 2,
    baths: 2,
    sqft: "1,400",
    views: 89,
    leads: 5,
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    title: "Garden Estate",
    location: "Coral Gables, FL",
    price: "$5,800",
    status: "active",
    beds: 5,
    baths: 4,
    sqft: "3,500",
    views: 312,
    leads: 18,
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
    title: "Luxury Penthouse",
    location: "Brickell, FL",
    price: "$8,500",
    status: "active",
    beds: 4,
    baths: 3,
    sqft: "2,200",
    views: 445,
    leads: 24,
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
    title: "Beachfront Condo",
    location: "South Beach, FL",
    price: "$6,200",
    status: "pending",
    beds: 3,
    baths: 2,
    sqft: "1,800",
    views: 198,
    leads: 11,
  },
];

export default function MyListings() {
  const [viewMode, setViewMode] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProperties =
    statusFilter === "all"
      ? allProperties
      : allProperties.filter((p) => p.status === statusFilter);

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
        <Button variant="premium" className="gap-2">
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
              <Input placeholder="Search properties..." className="pl-9" />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="newest">
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
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

      {/* Properties */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property, index) => (
            <div
              key={property.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <PropertyCard {...property} delay={0} />
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
                    <Badge variant={property.status}>{property.status}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {property.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {property.leads}
                      </span>
                      <span>
                        {property.beds} Beds • {property.baths} Baths
                      </span>
                    </div>

                    <p className="text-lg font-semibold text-primary">
                      {property.price}
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
