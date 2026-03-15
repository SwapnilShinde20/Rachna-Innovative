import React, { useState } from "react";
import { Filter } from "lucide-react";
import Navbar from "../../components/buyer/Navbar";
import Sidebar from "../../components/buyer/Sidebar";
import PropertyCard from "../../components/PropertyCard";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "../../lib/api";

const Buyer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: [],
    minPrice: 0,
    maxPrice: 50000000, 
    location: "",
    amenities: []
  });

  const { data: properties = [], isLoading, isPlaceholderData, error } = useQuery({
    queryKey: ['properties', searchQuery, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filters.type.length > 0) params.append('type', filters.type.join(',')); 
      
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice < 100000000) params.append('maxPrice', filters.maxPrice);
      if (filters.location) params.append('location', filters.location);
      if (filters.amenities.length > 0) params.append('amenities', filters.amenities.join(','));

      const { data } = await api.get(`/properties?${params.toString()}`);
      return data;
    },
    placeholderData: keepPreviousData
  });

  const handleSearch = (query) => {
      setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (isLoading) return <div className="p-10 text-center">Loading properties...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error loading properties: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar onSearch={handleSearch} />
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 text-gray-700 font-medium"
        >
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>
      <div className="flex max-w-[1600px] mx-auto">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.length > 0 ? (
                <>
                {properties.map((property) => (
                <PropertyCard 
                    key={property._id} 
                    property={{
                    ...property,
                    id: property._id,
                    image: property.images?.[0] || 'https://via.placeholder.com/300'
                    }} 
                />
                ))}
                {isPlaceholderData && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brandBlue-500"></div>
                    </div>
                )}
                </>
            ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                    No properties found matching your criteria.
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Buyer;
