import React from "react";
import { Search, MessageSquare, Bell, X, Home, House, ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const navItems = [
  {
    name: "Buy",
    link: "/buy",
  },
  {
    name: "Rent",
    link: "/rent",
  },
  {
    name: "Favorites",
    link: "/favorites",
  },
  {
    name: "Help",
    link: "/help",
  },
  {
    name: "Services",
    link: "/services",
  },
  {
    name: "Blog",
    link: "/blogs",
  },
];
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-50 font-inter">
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

      {/* Center Nav */}
      <div className="hidden md:flex bg-[#F6F8FA] rounded-full p-1 gap-1 border border-[#E4E4E4]">
        {navItems.map((item) => (
          <NavLink
            to={item.link}
            className={({ isActive }) =>
              isActive ? " px-5 py-2   rounded-full bg-white border border-[#E4E4E4] shadow-sm text-[#1F52D6] font-medium text-sm" : "px-5 py-2 rounded-full text-gray-500 hover:text-gray-900 font-medium text-sm"
            }
          >
            {item.name}
          </NavLink>
        ))}

      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
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

        <button className="p-2 border border-[#E4E4E4] bg-[#F6F8FA] w-[40px] h-[40px] rounded-full text-[#1F2937] flex justify-center items-center hover:bg-gray-100">
          <MessageSquare size={20} />
        </button>
        <button className="p-2 border border-[#E4E4E4] bg-[#F6F8FA] w-[40px] h-[40px] rounded-full text-[#1F2937] flex justify-center items-center hover:bg-gray-100">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <img
            src="/assets/pravin.png"
            alt="Profile"
            className="w-12 h-12  rounded-full object-cover border border-[#E4E4E4] "
          />
          <div className="hidden xl:block">
            <p className="text-base text-[#111827] font-semibold text-gray-900">Pravin Purav</p>
            <p className="text-xs text-[#4B5563]">pravin@gmail.com</p>
          </div>
          <ChevronDown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
