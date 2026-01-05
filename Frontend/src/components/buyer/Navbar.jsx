import React from 'react'
import { 
  Search, 
  MessageSquare, 
  Bell, 
  X,
  Home
} from 'lucide-react';
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-gray-900 text-white p-2 rounded-lg">
          <Home size={20} />
        </div>
        <div className="font-bold text-lg leading-tight">
          Rachna<br />Innovative
        </div>
      </div>

      {/* Center Nav */}
      <div className="hidden md:flex bg-gray-50 rounded-full p-1 gap-1">
        <button className="px-5 py-2 rounded-full bg-white shadow-sm text-blue-600 font-medium text-sm">Buy</button>
        <button className="px-5 py-2 rounded-full text-gray-500 hover:text-gray-900 font-medium text-sm">Rent</button>
        <button className="px-5 py-2 rounded-full text-gray-500 hover:text-gray-900 font-medium text-sm">Favorites</button>
        <button className="px-5 py-2 rounded-full text-gray-500 hover:text-gray-900 font-medium text-sm">Help</button>
        <button className="px-5 py-2 rounded-full text-gray-500 hover:text-gray-900 font-medium text-sm">Services</button>
        <button className="px-5 py-2 rounded-full text-gray-500 hover:text-gray-900 font-medium text-sm">Blog</button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Anything..." 
            className="pl-10 pr-10 py-2 bg-gray-50 rounded-full text-sm w-64 focus:outline-none focus:ring-1 focus:ring-gray-200"
          />
          <button className="absolute right-2 top-2 p-0.5 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300">
            <X size={14} />
          </button>
        </div>
        
        <button className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100"><MessageSquare size={20} /></button>
        <button className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100"><Bell size={20} /></button>
        
        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="hidden xl:block">
            <p className="text-sm font-semibold text-gray-900">Pravin Purav</p>
            <p className="text-xs text-gray-500">pravin@gmail.com</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar
