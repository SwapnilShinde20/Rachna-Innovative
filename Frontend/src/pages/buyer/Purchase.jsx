import React, { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Bell, 
  X, 
  MapPin, 
  ChevronDown, 
  Home, 
  Star,
  LayoutGrid
} from 'lucide-react';
import Navbar from '../../components/buyer/Navbar';
import Sidebar from '../../components/buyer/Sidebar';
import PropertyCard from '../../components/PropertyCard';

// --- Data Mock ---
const properties = [
  { id: 1, type: 'Home', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '33000', rating: 4.8, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600' },
  { id: 3, type: 'Home', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '333000', rating: 4.8, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600' },
  { id: 4, type: 'Home', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '43000', rating: 4.8, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600' },
  { id: 5, type: 'Home', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '36000', rating: 4.8, image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=600' },
  { id: 6, type: 'Villa', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '36000', rating: 4.8, image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=600' },
  { id: 7, type: 'Home', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '36000', rating: 4.8, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600' },
  { id: 8, type: 'Home', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '36000', rating: 4.8, image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80&w=600' },
  { id: 9, type: 'Home', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '36000', rating: 4.8, image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=600' },
  { id: 2, type: 'Home', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '36000', rating: 4.8, image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&q=80&w=600' },
  
];

const Buyer = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar />
      
      <div className="flex max-w-[1600px] mx-auto">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Buyer;