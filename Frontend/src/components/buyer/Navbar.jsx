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
  { name: "Services", link: "/services", hasDropdown: true },
  { name: "Blog", link: "/blogs" },
];

const Navbar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  // New state for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  // Separate state for mobile services dropdown to avoid conflict with desktop hover
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 font-inter">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-gray-900 text-white p-2 rounded-lg w-[56px] h-[56px] flex justify-center items-center">
            <House className="font-bold" size={30} />
          </div>
          <div className="font-bold text-lg leading-tight">
            Rachna
            <br />
            Innovative
          </div>
        </div>

        {/* Center Nav (Desktop) - Kept hidden md:flex */}
        <div className="hidden md:flex bg-[#F6F8FA] rounded-full p-1 gap-1 border border-[#E4E4E4]">
          {navItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      isActive
                        ? "px-5 py-2 rounded-full bg-white border border-[#E4E4E4] shadow-sm text-[#1F52D6] font-medium text-sm flex items-center gap-1"
                        : "px-5 py-2 rounded-full text-gray-500 hover:text-gray-900 font-medium text-sm flex items-center gap-1"
                    }
                  >
                    {item.name}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isServicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </NavLink>

                  {/* Desktop Dropdown Menu */}
                  {isServicesOpen && (
                    <div
                      className="absolute top-[80%] left-0 w-48 pt-4 z-50"
                      onMouseEnter={() => setIsServicesOpen(true)}
                      onMouseLeave={() => setIsServicesOpen(false)}
                    >
                      <div className="bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden p-1">
                        <Link
                          to="/services/legal"
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-[#F6F8FA] hover:text-[#1F52D6] rounded-lg transition-colors"
                        >
                          Legal Support
                        </Link>
                        <Link
                          to="/services/security"
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-[#F6F8FA] hover:text-[#1F52D6] rounded-lg transition-colors"
                        >
                          Security & Privacy
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.link}
                className={({ isActive }) =>
                  isActive
                    ? "px-5 py-2 rounded-full bg-white border border-[#E4E4E4] shadow-sm text-[#1F52D6] font-medium text-sm"
                    : "px-5 py-2 rounded-full text-gray-500 hover:text-gray-900 font-medium text-sm"
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
            <Search className="absolute left-3 top-3 text-[#1F2937]" size={20} />
            <input
              type="text"
              placeholder="Search Anything..."
              className="pl-10 pr-10 py-3 bg-white border border-[#E4E4E4] rounded-full text-sm w-64 focus:outline-none"
            />
            <button className="absolute w-[30px] h-[30px] right-2 top-2 p-0.5 bg-[#F6F8FA] border border-[#E4E4E4] rounded-full text-[#1F2937] cursor-pointer flex justify-center items-center">
              <X size={14} />
            </button>
          </div>

          <button className="hidden sm:flex p-2 border border-[#E4E4E4] bg-[#F6F8FA] w-[40px] h-[40px] rounded-full text-[#1F2937] justify-center items-center hover:bg-gray-100">
            <MessageSquare size={20} />
          </button>
          <button className="p-2 border border-[#E4E4E4] bg-[#F6F8FA] w-[40px] h-[40px] rounded-full text-[#1F2937] flex justify-center items-center hover:bg-gray-100">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/assets/pravin.png"
              alt="Profile"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-[#E4E4E4]"
            />
            <div className="hidden xl:block">
              <p className="text-base text-[#111827] font-semibold text-gray-900">
                Pravin Purav
              </p>
              <p className="text-xs text-[#4B5563]">pravin@gmail.com</p>
            </div>
            {/* Toggle Mobile Menu Button */}
            <button 
              className="md:hidden ml-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4 shadow-lg absolute w-full left-0">
          
          {/* Mobile Search (Visible only here on small screens) */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 text-[#1F2937]" size={20} />
            <input
              type="text"
              placeholder="Search Anything..."
              className="pl-10 pr-4 py-3 bg-[#F6F8FA] border border-[#E4E4E4] rounded-xl text-sm w-full focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.name} className="flex flex-col">
                    <button
                      onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                      className="px-4 py-3 rounded-xl text-gray-700 hover:bg-[#F6F8FA] font-medium text-sm flex justify-between items-center"
                    >
                      <span className="flex items-center gap-2">{item.name}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isMobileServicesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {/* Mobile Submenu */}
                    {isMobileServicesOpen && (
                      <div className="pl-6 flex flex-col gap-1 mt-1 bg-gray-50 rounded-lg py-2">
                         <Link
                          to="/services/legal"
                          className="px-4 py-2 text-sm text-gray-500 hover:text-[#1F52D6]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Legal Support
                        </Link>
                        <Link
                          to="/services/security"
                          className="px-4 py-2 text-sm text-gray-500 hover:text-[#1F52D6]"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Security & Privacy
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <NavLink
                  key={item.name}
                  to={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "px-4 py-3 rounded-xl bg-[#F6F8FA] border border-[#E4E4E4] text-[#1F52D6] font-medium text-sm"
                      : "px-4 py-3 rounded-xl text-gray-700 hover:bg-[#F6F8FA] font-medium text-sm"
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