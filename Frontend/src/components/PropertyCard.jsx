import React, { useState } from 'react'
import { 
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';


const PropertyCard = ({ property }) => {
  const [isFav,setFav] = useState(false)
   const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };
  const toogleHeart = (e)=>{
    e.preventDefault();
    setFav(!isFav)
  }
  return (
    <Link className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300" to={`/buy/${property.id}`}>
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
          <button onClick={(toogleHeart)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100">
             {isFav ? <i className="ri-heart-fill text-red-500"></i> : <i className="ri-heart-line text-red-500"></i>}
          </button>
        </div>
        
        <div className="mt-2 pt-2 border-t-2 border-neutral-gray-200 flex items-center justify-between">
          <span className="font-bold text-gray-900">{formatPrice(property.price)}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-orange-400 text-orange-400" />
            <span className="text-xs font-medium text-gray-600">{property.rating}/5</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard
