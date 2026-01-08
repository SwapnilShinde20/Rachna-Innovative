import React from 'react';
import { 
  X, 
  MapPin,
  Check
} from 'lucide-react';

// Compact Header Component
const FilterHeader = ({ title }) => (
  <div className="flex items-center justify-between bg-neutral-50 px-3 py-2 rounded-full mb-3">
    <div className="flex items-center gap-2 text-gray-700">
      <MapPin size={20} className="text-neutral-800" />
      <input placeholder={title} className="placeholder-neutral-400 text-sm outline-none bg-inherit w-full focus:text-neutral-500"/>
    </div>
    <div className="bg-white rounded-full p-0.5 w-[25px] h-[25px] cursor-pointer shadow-sm border border-neutral-200 flex items-center justify-center w-5 h-5">
      <i className="ri-close-fill text-neutral-800 font-semibold"></i>
    </div>
  </div>
);

const CheckboxItem = ({ label, checked }) => (
  <div className="flex items-center gap-3 my-5 pl-1 cursor-pointer group ">
    <div className={`w-6 h-6 rounded-[4px] border flex items-center justify-center transition-colors
      ${checked ? 'bg-brandBlue-500 border-brandBlue-500' : 'border-gray-300 bg-white'}`}>
      {checked && <Check size={14} className="text-white" strokeWidth={4} />}
    </div>
    <span className={`text-base ${checked ? 'text-gray-700 font-medium' : 'text-gray-700'}`}>
      {label}
    </span>
  </div>
);

const RadioItem = ({ label, checked }) => (
  <div className="flex items-center gap-3 my-4 pl-1 cursor-pointer">
    <div className={`w-5 h-5 rounded-full border flex items-center justify-center 
      ${checked ? 'border-brandBlue-500' : 'border-neutral-300'}`}>
      {checked && <div className="w-3 h-3 bg-brandBlue-500 rounded-full" />}
    </div>
    <span className={`text-base ${checked ? 'text-neutral-700 font-medium' : 'text-gray-700'}`}>
      {label}
    </span>
  </div>
);

const Sidebar = () => {
  return (
    <aside className="w-72 font-inter bg-white border-r border-gray-100 p-4 hidden md:block font-sans">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-6 px-1 pb-4 border-b-2 border-neutral-200 ">
        <h2 className="text-sm font-semibold text-neutral-800">Custom Filter</h2>
        <button className="text-brandBlue-500 text-sm font-regular hover:font-medium">
          Clear all
        </button>
      </div>

      {/* Location Section */}
      <div className="mb-6 pb-1 border-b-2 border-neutral-200">
        <FilterHeader title="Location" />
        <div className="px-1">
          <CheckboxItem label="Mumbai, India" checked={true} />
          <CheckboxItem label="Pune, India" checked={false} />
        </div>
      </div>

      {/* Price Range Section */}
      <div className="mb-6 pb-4 border-b-2 border-neutral-200">
        <FilterHeader title="Price Range" />
        <div className="px-1">
          <RadioItem label="Under $1000" checked={false} />
          <RadioItem label="$1000 - $15000" checked={false} />
          <RadioItem label="More than $15000" checked={false} />
          <RadioItem label="Custom" checked={true} />
          
          {/* Compact Slider */}
          <div className="mt-12 mb-2 px-1">
            <div className="relative h-5 bg-gray-100 rounded-full w-full">
              {/* Active Bar */}
              <div className="absolute left-[25%] right-[25%] h-full bg-brandBlue-500 rounded-full"></div>
              
              {/* Left Handle */}
              <div className="absolute left-[25%] top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[2.5px] border-brandBlue-500 rounded-full shadow cursor-pointer z-10 ">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-500 text-xs font-medium py-0.5 px-1.5 rounded-full border-2 border-neutral-200 shadow-sm whitespace-nowrap">
                  $10k
                </div>
              </div>

              {/* Right Handle */}
              <div className="absolute right-[25%] top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[2.5px] border-brandBlue-500 rounded-full shadow cursor-pointer z-10">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-500 text-xs font-medium py-0.5 px-1.5 rounded-full border-2 border-neutral-200 shadow-sm whitespace-nowrap">
                  $50k
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Land Area Section */}
      <div className="mb-6 pb-4 border-b-2 border-neutral-200">
        <FilterHeader title="Land Area" />
        <div className="flex gap-6 px-1 my-5">
           <div className="relative flex-1 ">
             <input 
               type="text" 
               placeholder="Min" 
               className="w-full  border border-neutral-200 rounded-md px-3 py-3 text-xs text-gray-600 placeholder-neutral-400 focus:outline-none " 
             />
             <span className="absolute right-2 top-3.5 text-[10px] text-neutral-400">sq ft</span>
           </div>
           <div className="relative flex-1">
             <input 
               type="text" 
               placeholder="Max" 
               className="w-full text-sm border border-neutral-200 rounded-md px-3 py-3 text-xs text-gray-600 placeholder-neutral-400 focus:outline-none " 
             />
             <span className="absolute right-2 top-3.5 text-[10px] text-neutral-400">sq ft</span>
           </div>
        </div>
      </div>

      {/* Type Of Place Section */}
      <div className="mb-6  pb-2 border-b-2 border-neutral-200">
        <FilterHeader title="Type Of Place" />
        <div className="px-1">
          <CheckboxItem label="Single Family House" checked={true} />
          <CheckboxItem label="Condo/Townhouse" checked={false} />
          <CheckboxItem label="Apartment" checked={true} />
          <CheckboxItem label="Bungalow" checked={false} />
        </div>
      </div>

      {/* Amenities Section */}
      <div className="mb-6 pb-8 border-b-2 border-neutral-200">
        <FilterHeader title="Amenities" />
        <div className="flex flex-wrap gap-2 px-1">
            <button className="bg-brandBlue-500 text-white text-sm px-4 py-1.5 rounded-[6px]  ">
              Garden
            </button>
            <button className="bg-white text-neutral-500 text-sm px-4 py-1.5 rounded-[6px] border border-neutral-200">
              Gym
            </button>
            <button className="bg-white text-neutral-500 text-sm px-4 py-1.5 rounded-[6px] border border-neutral-200 ">
              Garage
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;