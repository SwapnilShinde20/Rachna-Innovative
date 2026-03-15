import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart, Search, SlidersHorizontal, ArrowRight, Loader2
} from "lucide-react";
import Navbar from "../../components/buyer/Navbar";
import PropertyCard from "../../components/PropertyCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";

const Favorites = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch favorites from real API
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { data } = await api.get("/users/favorites");
      return data;
    },
  });

  // Remove mutation
  const removeMutation = useMutation({
    mutationFn: (propertyId) =>
      api.post("/users/favorites/toggle", { propertyId }),
    onSuccess: () => queryClient.invalidateQueries(["favorites"]),
  });

  // Filter & Sort
  const filtered = favorites
    .filter(
      (item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="min-h-screen bg-neutral-50 font-sans pb-20">
      <Navbar />

      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
            My Favorites
          </h1>
          <p className="text-gray-500">
            {isLoading
              ? "Loading..."
              : <>You have <span className="font-bold text-blue-600">{favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}</span>.</>}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-blue-500" />
          </div>
        ) : favorites.length > 0 ? (
          <>
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by title, location or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-sm text-gray-500 whitespace-nowrap hidden sm:block">Sort by:</span>
                <div className="relative w-full md:w-56">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-blue-400 cursor-pointer shadow-sm"
                  >
                    <option value="newest">Newest Added</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                  <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={{
                      ...property,
                      id: property._id,
                      image: property.images?.[0] || null,
                      location: `${property.location || ''}, ${property.city || ''}`.replace(/^, |, $/g, ''),
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">No properties match "{searchTerm}".</p>
                <button onClick={() => setSearchTerm("")} className="mt-3 text-blue-600 font-semibold hover:underline text-sm">
                  Clear Search
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 text-center shadow-sm">
            <div className="bg-blue-50 p-5 rounded-full mb-6 animate-pulse">
              <Heart size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-500 max-w-md mb-8">
              Your favorites list is empty. Start browsing to save your dream homes here!
            </p>
            <Link
              to="/buy"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Browse Properties
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;