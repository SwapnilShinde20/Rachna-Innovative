import React, { useState } from "react";
import {
  Search,
  MessageSquare,
  Bell,
  X,
  House,
  ChevronDown,
  Menu, // Added Menu icon
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const navItems = [
  { name: "Buy", link: "/buy" },
  { name: "Rent", link: "/rent" },
  { name: "Favorites", link: "/favorites" },
  { name: "Help", link: "/help" },
  { name: "Services", link: "/services"},
  { name: "Blog", link: "/blogs" },
];

const Navbar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  // New state for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  // Separate state for mobile services dropdown to avoid conflict with desktop hover
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  return (
    <nav className="bg-white border-b-2 border-neutral-50 sticky top-0 z-50 font-inter">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-900 text-white p-2 rounded-lg w-[56px] h-[56px] flex justify-center items-center">
            <House className="font-bold" size={30} />
          </div>
          <div className="font-bold text-lg leading-tight text-neutral-800">
            Rachna
            <br />
            Innovative
          </div>
        </div>

        {/* Center Nav (Desktop) - Kept hidden md:flex */}
        <div className="hidden md:flex bg-neutral-50 rounded-full p-1 gap-1 border border-neutral-200">
          {navItems.map((item) => {
           

            return (
              <NavLink
                key={item.name}
                to={item.link}
                className={({ isActive }) =>
                  isActive
                    ? "px-5 py-2 rounded-full bg-white border border-neutral-200 shadow-sm text-brandBlue-600 font-medium text-sm"
                    : "px-5 py-2 rounded-full text-neutral-500 hover:text-neutral-900 font-medium text-sm"
                }
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Desktop Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-3 text-neutral-800" size={20} />
            <input
              type="text"
              placeholder="Search Anything..."
              className="pl-10 pr-10 py-3 bg-white border border-neutral-200 rounded-full text-sm w-64 focus:outline-none"
            />
            <button className="absolute w-[30px] h-[30px] right-2 top-2 p-0.5 bg-neutral-50 border border-neutral-200 rounded-full text-neutral-800 cursor-pointer flex justify-center items-center">
              <X size={14} />
            </button>
          </div>

          <button className="hidden sm:flex p-2 border border-neutral-200 bg-neutral-50 w-[40px] h-[40px] rounded-full text-neutral-800 justify-center items-center hover:bg-neutral-100">
            <MessageSquare size={20} />
          </button>
          <button className="p-2 border border-neutral-200 bg-neutral-50 w-[40px] h-[40px] rounded-full text-neutral-800 flex justify-center items-center hover:bg-neutral-100">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/assets/pravin.png"
              alt="Profile"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-neutral-200"
            />
            <div className="hidden xl:block">
              <p className="text-base text-neutral-800 font-semibold text-neutral-800">
                Pravin Purav
              </p>
              <p className="text-xs text-neutral-600">pravin@gmail.com</p>
            </div>
            {/* Toggle Mobile Menu Button */}
            <button 
              className="md:hidden ml-2 text-neutral-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-300 px-6 py-4 flex flex-col gap-4 shadow-lg absolute w-full left-0">
          
          {/* Mobile Search (Visible only here on small screens) */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 texttext-neutral-800" size={20} />
            <input
              type="text"
              placeholder="Search Anything..."
              className="pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm w-full focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
           
              return (
                <NavLink
                  key={item.name}
                  to={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-brandBlue-500 font-medium text-sm"
                      : "px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-50 font-medium text-sm"
                  }
                >
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;