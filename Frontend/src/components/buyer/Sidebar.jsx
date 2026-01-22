import React, { useRef, useState } from "react";
import { X, MapPin, Check } from "lucide-react";

// Compact Header Component
const FilterHeader = ({ title }) => (
  <div className="flex items-center justify-between bg-neutral-50 px-3 py-2 rounded-full mb-3">
    <div className="flex items-center gap-2 text-gray-700">
      <MapPin size={20} className="text-neutral-800" />
      <input
        placeholder={title}
        className="placeholder-neutral-400 text-sm outline-none bg-inherit w-full focus:text-neutral-500"
      />
    </div>
    <div className="bg-white rounded-full p-0.5 w-[25px] h-[25px] cursor-pointer shadow-sm border border-neutral-200 flex items-center justify-center">
      <i className="ri-close-fill text-neutral-800 font-semibold"></i>
    </div>
  </div>
);

const CheckboxItem = ({ label, defaultChecked = false, onChange }) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = (e) => {
    const value = e.target.checked;
    setChecked(value);
    onChange?.(value); // optional callback to parent
  };

  return (
    <label className="flex items-center gap-3 my-5 pl-1 cursor-pointer group select-none">
      {/* Native checkbox (hidden) */}
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={handleChange}
        className="peer sr-only"
      />

      {/* Custom checkbox UI */}
      <div
        className={`
          w-6 h-6 rounded-[4px] border flex items-center justify-center transition-colors
          ${
            checked
              ? "bg-brandBlue-500 border-brandBlue-500"
              : "border-gray-300 bg-white"
          }
          peer-focus-visible:ring-2 peer-focus-visible:ring-brandBlue-500/50
        `}
      >
        {checked && <Check size={14} className="text-white" strokeWidth={4} />}
      </div>

      {/* Label */}
      <span
        className={`
          text-base transition-colors
          ${checked ? "text-gray-700 font-medium" : "text-gray-700"}
        `}
      >
        {label}
      </span>
    </label>
  );
};

const RadioItem = ({ label, name, value, selectedValue, onChange }) => {
  const checked = selectedValue === value;

  return (
    <label className="flex items-center gap-3 my-4 pl-1 cursor-pointer select-none">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />

      <div
        className={`
          w-5 h-5 rounded-full border flex items-center justify-center transition-colors
          ${checked ? "border-brandBlue-500" : "border-neutral-300"}
          peer-focus-visible:ring-2 peer-focus-visible:ring-brandBlue-500/50
        `}
      >
        {checked && <div className="w-3 h-3 bg-brandBlue-500 rounded-full" />}
      </div>

      <span
        className={`
          text-base transition-colors
          ${checked ? "text-neutral-700 font-medium" : "text-gray-700"}
        `}
      >
        {label}
      </span>
    </label>
  );
};

// Receive isOpen and onClose props
const Sidebar = ({ isOpen, onClose }) => {
  const [priceRange, setPriceRange] = useState("custom");
  const [minPrice, setMinPrice] = useState(30);
  const [maxPrice, setMaxPrice] = useState(60);
  const sliderRef = useRef(null);
  const MIN_GAP = 20; // minimum difference between minPrice and maxPrice

  const MIN = 0;
  const MAX = 100;

  const startDrag = (e, type) => {
    e.preventDefault();

    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();

    const onMouseMove = (moveEvent) => {
      const x = moveEvent.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, x / rect.width));
      const value = Math.round(percent * MAX);

      if (type === "min") {
        // Enforce: min must be at least MIN_GAP less than max
        if (value <= maxPrice - MIN_GAP) {
          setMinPrice(value);
        }
      } else {
        // Enforce: max must be at least MIN_GAP more than min
        if (value >= minPrice + MIN_GAP) {
          setMaxPrice(value);
        }
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      {/* 1. Mobile Overlay (Backdrop) */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* 2. Sidebar Container with Slide Animation */}
      <aside
        className={`
          font-inter bg-white border-r border-gray-100 p-4 
          fixed top-0 bottom-0 left-0 z-50 w-72 overflow-y-auto shadow-2xl
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none lg:block lg:z-0 lg:h-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Main Header */}
        <div className="flex items-center justify-between mb-6 px-1 pb-4 border-b-2 border-neutral-200">
          <h2 className="text-sm font-semibold text-neutral-800">
            Custom Filter
          </h2>

          <div className="flex items-center gap-3">
            <button className="text-brandBlue-500 text-sm font-regular hover:font-medium">
              Clear all
            </button>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Location Section */}
        <div className="mb-6 pb-1 border-b-2 border-neutral-200">
          <FilterHeader title="Location" />
          <div className="px-1">
            <CheckboxItem label="Mumbai, India" defaultChecked={true} />
            <CheckboxItem label="Pune, India" />
          </div>
        </div>

        {/* Price Range Section */}
        <div className="mb-6 pb-4 border-b-2 border-neutral-200">
          <FilterHeader title="Price Range" />
          <div className="px-1">
            <RadioItem
              name="price"
              value="under-1000"
              label="Under $1000"
              selectedValue={priceRange}
              onChange={setPriceRange}
            />

            <RadioItem
              name="price"
              value="1000-15000"
              label="$1000 - $15000"
              selectedValue={priceRange}
              onChange={setPriceRange}
            />

            <RadioItem
              name="price"
              value="more-than-15000"
              label="More than $15000"
              selectedValue={priceRange}
              onChange={setPriceRange}
            />

            <RadioItem
              name="price"
              value="custom"
              label="Custom"
              selectedValue={priceRange}
              onChange={setPriceRange}
            />

            {/* Compact Slider (show only when Custom selected) */}
            {priceRange === "custom" && (
              <div className="mt-12 mb-2 px-1">
                <div
                  ref={sliderRef}
                  className="relative h-5 w-full select-none"
                >
                  {/* Track */}
                  <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full rounded-full bg-gray-100" />

                  {/* Active Range */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-brandBlue-500"
                    style={{
                      left: `${(minPrice / MAX) * 100}%`,
                      right: `${100 - (maxPrice / MAX) * 100}%`,
                    }}
                  />

                  {/* Min Handle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[2.5px] border-brandBlue-500 rounded-full shadow cursor-pointer z-20"
                    style={{ left: `calc(${(minPrice / MAX) * 100}% - 10px)` }}
                    onMouseDown={(e) => startDrag(e, "min")}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-500 text-xs font-medium py-0.5 px-1.5 rounded-full border-2 border-neutral-200 shadow-sm whitespace-nowrap">
                      ${minPrice}k
                    </div>
                  </div>

                  {/* Max Handle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-[2.5px] border-brandBlue-500 rounded-full shadow cursor-pointer z-20"
                    style={{ left: `calc(${(maxPrice / MAX) * 100}% - 10px)` }}
                    onMouseDown={(e) => startDrag(e, "max")}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-500 text-xs font-medium py-0.5 px-1.5 rounded-full border-2 border-neutral-200 shadow-sm whitespace-nowrap">
                      ${maxPrice}k
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Land Area Section */}
        <div className="mb-6 pb-4 border-b-2 border-neutral-200">
  <FilterHeader title="Land Area" />

  <div className="flex gap-6 px-1 my-5">
    {/* Min Input */}
    <div className="relative flex-1">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Min"
        className="w-full border border-neutral-200 rounded-md px-3 py-3 text-xs text-gray-600 placeholder-neutral-400 focus:outline-none"
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          e.target.value = value;
        }}
      />
      <span className="absolute right-2 top-3.5 text-[10px] text-neutral-400">
        sq ft
      </span>
    </div>

    {/* Max Input */}
    <div className="relative flex-1">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Max"
        className="w-full border border-neutral-200 rounded-md px-3 py-3 text-xs text-gray-600 placeholder-neutral-400 focus:outline-none"
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          e.target.value = value;
        }}
      />
      <span className="absolute right-2 top-3.5 text-[10px] text-neutral-400">
        sq ft
      </span>
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
    </>
  );
};

export default Sidebar;
