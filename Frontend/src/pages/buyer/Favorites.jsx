import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Move,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Star
} from "lucide-react";
import Navbar from "../../components/buyer/Navbar";
import PropertyCard from "../../components/PropertyCard";

// Mock Data matching your screenshot
const INITIAL_FAVORITES = [
  {
    id: 4, // Matching the ID from your screenshot logic
    title: "Skyline Penthouse",
    location: "101 Biscayne Blvd, Miami, FL",
    price: 6200000,
    image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=1600&auto=format&fit=crop",
    beds: 4,
    baths: 4.5,
    sqft: 3800,
    type: "Apartment",
    rating: 5,
    status: "Active",
    dateAdded: "2023-11-05",
  },
  {
    id: 2,
    title: "Modern Downtown Loft",
    location: "450 Brickell Ave, Miami, FL",
    price: 3200, // Assuming rent
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop",
    beds: 2,
    baths: 2,
    sqft: 1450,
    type: "Villa",
    rating: 5,
    status: "Active",
    dateAdded: "2023-11-01",
  },
  {
    id: 1,
    title: "Luxury Waterfront Villa",
    location: "123 Ocean Dr, Miami Beach, FL",
    price: 4500000,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
    beds: 5,
    baths: 4,
    sqft: 4200,
    type: "Villa",
    rating: 5,
    status: "Active",
    dateAdded: "2023-10-24",
  },
  {
    id: 3,
    title: "Cozy Garden Cottage",
    location: "789 Pine Lane, Coral Gables, FL",
    price: 850000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: "Apartment",
    rating: 5,
    status: "Pending",
    dateAdded: "2023-10-15",
  },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Handle Remove
  const removeFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  // Filter & Sort
  const filteredFavorites = favorites
    .filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    });

  // Helper to format currency (e.g. 6,200,000)
 

  return (
    <div className="min-h-screen bg-neutral-50 font-sans pb-20">
      <Navbar />

      {/* Header Section */}
      <div className=" border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">
            My Favorites
          </h1>
          <p className="text-[#6B7280]">
            You have <span className="font-bold text-[#1F52D6]">{favorites.length} saved properties</span>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Toolbar: Search & Sort */}
        {favorites.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
              <input
                type="text"
                placeholder="Search by address or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1F52D6] focus:ring-1 focus:ring-[#1F52D6] transition-all shadow-sm"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-sm text-[#6B7280] whitespace-nowrap hidden sm:block">Sort by:</span>
              <div className="relative w-full md:w-56">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border border-[#E5E7EB] text-[#374151] py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-[#1F52D6] cursor-pointer shadow-sm"
                >
                  <option value="newest">Newest Added</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((property) => (
              <PropertyCard property={property}/>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-[#E5E7EB] text-center shadow-sm">
            <div className="bg-[#F2F7FF] p-5 rounded-full mb-6 animate-pulse">
              <Heart size={48} className="text-[#1F52D6]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">
              {searchTerm ? "No matches found" : "No favorites yet"}
            </h2>
            <p className="text-[#6B7280] max-w-md mb-8">
              {searchTerm 
                ? `We couldn't find any properties matching "${searchTerm}".`
                : "Your favorites list is empty. Start browsing to save your dream homes here!"}
            </p>
            {searchTerm ? (
               <button 
                onClick={() => setSearchTerm("")}
                className="text-[#1F52D6] font-semibold hover:underline"
               >
                 Clear Search Filters
               </button>
            ) : (
              <Link
                to="/buy"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1F52D6] text-white rounded-full font-semibold hover:bg-[#183EAA] transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300"
              >
                Browse Properties
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;