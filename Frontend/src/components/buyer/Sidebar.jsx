import React from 'react';
import { 
  X, 
  MapPin,
  Check
} from 'lucide-react';

// Compact Header Component
const FilterHeader = ({ title }) => (
  <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl mb-3">
    <div className="flex items-center gap-2 text-gray-700">
      <MapPin size={16} className="text-gray-500" />
      <span className="text-gray-600 text-[13px] font-medium">{title}</span>
    </div>
    <div className="bg-white rounded-full p-0.5 cursor-pointer shadow-sm border border-gray-100 flex items-center justify-center w-5 h-5">
      <X size={10} className="text-gray-400" />
    </div>
  </div>
);

const CheckboxItem = ({ label, checked }) => (
  <div className="flex items-center gap-3 mb-2.5 pl-1 cursor-pointer group">
    <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors
      ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
      {checked && <Check size={12} className="text-white" strokeWidth={3} />}
    </div>
    <span className={`text-[13px] ${checked ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
      {label}
    </span>
  </div>
);

const RadioItem = ({ label, checked }) => (
  <div className="flex items-center gap-3 mb-2.5 pl-1 cursor-pointer">
    <div className={`w-4 h-4 rounded-full border flex items-center justify-center 
      ${checked ? 'border-blue-600' : 'border-gray-300'}`}>
      {checked && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
    </div>
    <span className={`text-[13px] ${checked ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
      {label}
    </span>
  </div>
);

const Sidebar = () => {
  return (
    <aside className="w-72 bg-white border-r border-gray-100 p-4 hidden md:block font-sans">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <h2 className="text-[15px] font-bold text-gray-900">Custom Filter</h2>
        <button className="text-blue-600 text-[13px] font-medium hover:underline">
          Clear all
        </button>
      </div>

      {/* Location Section */}
      <div className="mb-5">
        <FilterHeader title="Location" />
        <div className="px-1">
          <CheckboxItem label="Mumbai, India" checked={true} />
          <CheckboxItem label="Pune, India" checked={false} />
        </div>
      </div>

      {/* Price Range Section */}
      <div className="mb-5">
        <FilterHeader title="Price Range" />
        <div className="px-1">
          <RadioItem label="Under $1000" checked={false} />
          <RadioItem label="$1000 - $15000" checked={false} />
          <RadioItem label="More than $15000" checked={false} />
          <RadioItem label="Custom" checked={true} />
          
          {/* Compact Slider */}
          <div className="mt-7 mb-2 px-1">
            <div className="relative h-1 bg-gray-100 rounded-full w-full">
              {/* Active Bar */}
              <div className="absolute left-[25%] right-[25%] h-full bg-blue-600 rounded-full"></div>
              
              {/* Left Handle */}
              <div className="absolute left-[25%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[2.5px] border-blue-600 rounded-full shadow cursor-pointer z-10">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-gray-500 text-[10px] font-medium py-0.5 px-1.5 rounded border border-gray-100 shadow-sm whitespace-nowrap">
                  $10k
                </div>
              </div>

              {/* Right Handle */}
              <div className="absolute right-[25%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[2.5px] border-blue-600 rounded-full shadow cursor-pointer z-10">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-gray-500 text-[10px] font-medium py-0.5 px-1.5 rounded border border-gray-100 shadow-sm whitespace-nowrap">
                  $50k
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Land Area Section */}
      <div className="mb-5">
        <FilterHeader title="Land Area" />
        <div className="flex gap-2 px-1">
           <div className="relative flex-1">
             <input 
               type="text" 
               placeholder="Min" 
               className="w-full border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-500" 
             />
             <span className="absolute right-2 top-2.5 text-[10px] text-gray-400">sq ft</span>
           </div>
           <div className="relative flex-1">
             <input 
               type="text" 
               placeholder="Max" 
               className="w-full border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-500" 
             />
             <span className="absolute right-2 top-2.5 text-[10px] text-gray-400">sq ft</span>
           </div>
        </div>
      </div>

      {/* Type Of Place Section */}
      <div className="mb-5">
        <FilterHeader title="Type Of Place" />
        <div className="px-1">
          <CheckboxItem label="Single Family House" checked={true} />
          <CheckboxItem label="Condo/Townhouse" checked={false} />
          <CheckboxItem label="Apartment" checked={true} />
          <CheckboxItem label="Bungalow" checked={false} />
        </div>
      </div>

      {/* Amenities Section */}
      <div className="mb-5">
        <FilterHeader title="Amenities" />
        <div className="flex flex-wrap gap-2 px-1">
            <button className="bg-blue-600 text-white text-[11px] px-4 py-1.5 rounded-[6px] font-medium hover:bg-blue-700 transition-colors">
              Garden
            </button>
            <button className="bg-white text-gray-500 text-[11px] px-4 py-1.5 rounded-[6px] border border-gray-200 font-medium hover:border-gray-300 transition-colors">
              Gym
            </button>
            <button className="bg-white text-gray-500 text-[11px] px-4 py-1.5 rounded-[6px] border border-gray-200 font-medium hover:border-gray-300 transition-colors">
              Garage
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;