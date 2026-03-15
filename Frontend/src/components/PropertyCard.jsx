import React, { useState, useEffect } from 'react'
import { Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuthStore } from '../stores/authStore';

const PropertyCard = ({ property }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Get current favorites list from cache
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await api.get('/users/favorites');
      return data;
    },
    enabled: !!user,
    staleTime: 60000,
  });

  const isFav = favorites.some((f) => f._id === (property._id || property.id));

  const favMutation = useMutation({
    mutationFn: () =>
      api.post('/users/favorites/toggle', { propertyId: property._id || property.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    },
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const toggleHeart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return; // Silent if not logged in
    favMutation.mutate();
  };

  return (
    <Link
      className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
      to={`/buy/${property._id || property.id}`}
    >
      {/* Background Image */}
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Top Badge */}
      <div className="absolute top-4 left-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold bg-white ${
            property.type === 'Apartment'
              ? 'text-green-600'
              : property.type === 'Villa'
              ? 'text-blue-600'
              : property.type === 'House'
              ? 'text-purple-600'
              : 'text-cyan-600'
          }`}
        >
          {property.type}
        </span>
      </div>

      {/* Content Overlay Card */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-sm font-bold text-gray-900 truncate">{property.title}</h3>
            <p className="text-[10px] text-gray-500 truncate">{property.location}</p>
          </div>
          <button
            onClick={toggleHeart}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all shrink-0 ${
              isFav ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <Heart
              size={15}
              className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="font-bold text-gray-900 text-sm">{formatPrice(property.price)}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-orange-400 text-orange-400" />
            <span className="text-xs font-medium text-gray-600">{property.rating || 0}/5</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
