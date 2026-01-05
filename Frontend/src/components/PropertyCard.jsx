import React from 'react'
import { 
  Star
} from 'lucide-react';


const PropertyCard = ({ property }) => {
  return (
    <div className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Background Image */}
      <img 
        src={property.image} 
        alt={property.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Top Badge */}
      <div className="absolute top-4 left-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-white ${property.type === 'Apartment' ? 'text-green-600' : property.type === 'Villa' ? 'text-blue-600' : 'text-cyan-600'}`}>
            {property.type}
        </span>
      </div>

      {/* Content Overlay Card */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="text-sm font-bold text-gray-900">{property.title}</h3>
            <p className="text-[10px] text-gray-500">{property.location}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100">
             <div className="w-3 h-4 border border-gray-300 border-t-0 bg-gray-200"></div> {/* Simplified Bookmark Icon */}
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="font-bold text-gray-900">{property.price}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-orange-400 text-orange-400" />
            <span className="text-xs font-medium text-gray-600">{property.rating}/5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard
