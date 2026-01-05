import React, { useState } from 'react';
import { MapPin, Home, Star } from 'lucide-react';

// Importing your existing components
import Navbar from '../components/buyer/Navbar';
import PropertyCard from '../components/PropertyCard';
// Sidebar is imported as requested, though visually this page uses a different right-column structure
import Sidebar from '../components/buyer/Sidebar'; 

const PropertyDetails = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  // Mock data for the "Similar Places" sidebar
  const similarProperties = [
    { id: 1, type: 'Home', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '33 CR', rating: 4.8, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600' },
    { id: 2, type: 'Villa', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '33 CR', rating: 4.8, image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=600' },
    { id: 3, type: 'Home', title: 'Dream House Reality', location: 'Powai, Mumbai, India', price: '33 CR', rating: 4.8, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-10">
      <Navbar />

      {/* Main Container - Centered with max width */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-6">
        
        {/* Flex Container: Left Content (Flexible) + Right Sidebar (Fixed 375px) */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="flex-1 w-full min-w-0 space-y-8">
            
            {/* 1. Image Gallery - Fixed Layout to prevent overlap */}
            <div className="h-[400px] md:h-[480px] w-full flex gap-4">
              {/* Left: Main Large Image (50-60% width) */}
              <div className="w-1/2 md:w-3/5 h-full relative group overflow-hidden rounded-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Main view" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Right: Mosaic (Remaining width) */}
              <div className="flex-1 flex flex-col gap-4 h-full">
                {/* Top Row: 2 Images */}
                <div className="h-1/2 flex gap-4 w-full">
                   <div className="w-1/2 h-full overflow-hidden rounded-2xl relative group">
                     <img 
                      src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600" 
                      alt="Interior 1" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                   </div>
                   <div className="w-1/2 h-full overflow-hidden rounded-2xl relative group">
                     <img 
                      src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=600" 
                      alt="Interior 2" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                   </div>
                </div>
                {/* Bottom Row: 1 Wide Image */}
                <div className="h-1/2 w-full overflow-hidden rounded-2xl relative group">
                   <img 
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800" 
                    alt="Pool Area" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* 2. Header Info */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dream House Reality</h1>
                <div className="flex items-center gap-2 mt-2 text-gray-500">
                  <MapPin size={18} className="text-blue-500" />
                  <span className="text-base">Powai, Mumbai, India</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                $ 45200
              </div>
            </div>

            {/* 3. Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-16">
                {['Overview', 'Reviews', 'About'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-base font-semibold transition-all relative ${
                      activeTab === tab 
                        ? 'text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Description :</h2>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                Welcome to Midnight Ridge Villa , Experience a peaceful escape at Midnight Ridge Villa, a modern retreat set on a quiet hillside with stunning views of valleys and starry nights.
              </p>
            </div>

            {/* 5. Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
               <FeaturePill label="6 Rooms" />
               <FeaturePill label="4 Beds" />
               <FeaturePill label="2 Baths" />
               <FeaturePill label="2 Kitchen" />
               <FeaturePill label="4.420 sqft" />
               <FeaturePill label="2 Garage" />
            </div>

            {/* 6. Map Area */}
            <div className="w-full h-[320px] rounded-2xl overflow-hidden relative shadow-sm border border-gray-100 bg-blue-50">
               {/* Map Background */}
               <img 
                 src="https://mt1.google.com/vt/lyrs=m&x=10&y=10&z=5" 
                 alt="Map Location" 
                 className="w-full h-full object-cover opacity-60 grayscale-[20%]"
               />
               
               {/* Map Overlay Markers (Simulated to match design) */}
               <div className="absolute inset-0 pointer-events-none">
                   {/* Center Pulse */}
                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-pink-500/30 w-16 h-16 rounded-full animate-ping absolute"></div>
                      <div className="bg-pink-500 w-4 h-4 rounded-full relative border-2 border-white shadow-lg"></div>
                   </div>
                   
                   {/* Label: TCS Olympus */}
                   <div className="absolute top-[40%] left-[55%] bg-white/90 backdrop-blur px-3 py-1.5 rounded-md shadow-md text-xs font-semibold text-gray-600 flex items-center gap-2 border border-gray-200">
                     <div className="w-2 h-2 bg-gray-400 rounded-full"></div> 
                     TCS Olympus Block-A
                   </div>

                    {/* Label: Sleep Company */}
                    <div className="absolute bottom-6 left-6 bg-white px-3 py-2 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 w-max">
                     <div className="bg-blue-500 p-1.5 rounded-lg text-white shadow-blue-200 shadow-lg">
                        <MapPin size={16}/>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-gray-800">The Sleep Company</p>
                        <p className="text-[10px] text-gray-400">Experience Store - Ghod...</p>
                     </div>
                   </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Similar Places Sidebar */}
          {/* Constrained to 375px exactly as requested */}
          <div className="w-full lg:w-[375px] shrink-0">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Places</h2>
            <div className="flex flex-col gap-6">
              {similarProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// Reusable Feature Pill Component
const FeaturePill = ({ label }) => (
  <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] h-14 flex justify-center items-center hover:border-gray-200 transition-colors">
    <span className="font-bold text-gray-800 text-sm md:text-base">{label}</span>
  </div>
);

export default PropertyDetails;