import React from 'react'
import { 
  X, 
  MapPin
} from 'lucide-react';
const FilterSection = ({ title, children, clearable = false }) => (
  <div className="mb-6 border-b border-gray-100 pb-6 last:border-0">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <MapPin size={18} className="text-gray-400" />
        {title}
      </div>
      {clearable && <X size={16} className="text-gray-400 cursor-pointer" />}
    </div>
    {children}
  </div>
);

const CheckboxItem = ({ label, checked }) => (
  <div className="flex items-center gap-3 mb-3">
    <div className={`w-5 h-5 rounded border flex items-center justify-center ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
      {checked && <div className="w-2 h-2 bg-white rounded-sm" />}
    </div>
    <span className="text-gray-600 text-sm">{label}</span>
  </div>
);

const RadioItem = ({ label, checked }) => (
  <div className="flex items-center gap-3 mb-3">
    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${checked ? 'border-blue-600' : 'border-gray-300'}`}>
      {checked && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
    </div>
    <span className="text-gray-600 text-sm">{label}</span>
  </div>
);

const Sidebar = () => {
  return (
    <aside className="w-72 bg-white border-r border-gray-100 p-6 hidden md:block ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-gray-900">Custom Filter</h2>
        <button className="text-blue-500 text-xs font-medium">Clear all</button>
      </div>

      {/* Location */}
      <FilterSection title="Location" clearable>
        <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-between mb-4">
          <span className="text-gray-500 text-sm">Location</span>
          <X size={14} className="text-gray-400" />
        </div>
        <CheckboxItem label="Mumbai, India" checked={true} />
        <CheckboxItem label="Pune, India" checked={false} />
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" clearable>
        <RadioItem label="Under $1000" checked={false} />
        <RadioItem label="$1000 - $15000" checked={false} />
        <RadioItem label="More than $15000" checked={false} />
        <RadioItem label="Custom" checked={true} />
        
        {/* Custom Slider Mock */}
        <div className="mt-4 px-1">
          <div className="relative h-1.5 bg-gray-200 rounded-full w-full">
            <div className="absolute left-1/4 right-1/4 h-full bg-blue-600 rounded-full"></div>
            <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow cursor-pointer">
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-[10px] py-0.5 px-1.5 rounded border border-gray-200 shadow-sm">$10k</span>
            </div>
            <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow cursor-pointer">
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-[10px] py-0.5 px-1.5 rounded border border-gray-200 shadow-sm">$50k</span>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Land Area */}
      <FilterSection title="Land Area" clearable>
        <div className="flex gap-2">
           <div className="relative flex-1">
             <input type="text" placeholder="Min" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-blue-500" />
             <span className="absolute right-2 top-2.5 text-[10px] text-gray-400">sq ft</span>
           </div>
           <div className="relative flex-1">
             <input type="text" placeholder="Max" className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-blue-500" />
             <span className="absolute right-2 top-2.5 text-[10px] text-gray-400">sq ft</span>
           </div>
        </div>
      </FilterSection>

      {/* Type Of Place */}
      <FilterSection title="Type Of Place" clearable>
        <CheckboxItem label="Single Family House" checked={true} />
        <CheckboxItem label="Condo/Townhouse" checked={false} />
        <CheckboxItem label="Apartment" checked={true} />
        <CheckboxItem label="Bungalow" checked={false} />
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities" clearable>
        <div className="flex flex-wrap gap-2">
            <button className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded border border-blue-600">Garden</button>
            <button className="bg-white text-gray-500 text-xs px-4 py-1.5 rounded border border-gray-200">Gym</button>
            <button className="bg-white text-gray-500 text-xs px-4 py-1.5 rounded border border-gray-200">Garage</button>
        </div>
      </FilterSection>
    </aside>
  );
};

export default Sidebar
