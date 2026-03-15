import React from 'react';
import { Home, Calendar as CalendarIcon, Clock, CheckCircle, Briefcase, User, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

export const BuyerSidebar = ({ activeItem, onItemClick, isOpen, onClose }) => {
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'tours', label: 'Upcoming Tours', icon: CalendarIcon },
    { id: 'pending', label: 'Pending Requests', icon: Clock },
    { id: 'history', label: 'Past History', icon: CheckCircle },
    { id: 'services', label: 'Service Inquiries', icon: Briefcase },
  ];

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-neutral-100 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-50 flex-shrink-0">
            <span className="text-xl font-black bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent transform transition-all hover:scale-105">
              RachnaWithAI
            </span>
            <button onClick={onClose} className="lg:hidden text-neutral-400 hover:text-neutral-900 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
            <div className="space-y-1.5">
              <p className="px-3 mb-4 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                Buyer Dashboard
              </p>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onItemClick(item.id);
                      onClose();
                    }}
                    className={cn(
                      "w-full group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden relative",
                      isActive
                        ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brandBlue-400 to-brandBlue-600 rounded-r-md" />
                    )}
                    <div className="flex items-center gap-3 relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                      <Icon
                        size={18}
                        className={cn(
                          "transition-colors duration-300",
                          isActive
                            ? "text-brandBlue-400"
                            : "text-neutral-400 group-hover:text-brandBlue-500"
                        )}
                      />
                      <span className="text-[13px] font-semibold tracking-wide">
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <ChevronRight size={14} className="text-neutral-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-neutral-50 bg-neutral-50/50 mt-auto flex-shrink-0">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold text-rose-600 rounded-xl hover:bg-rose-50 hover:text-rose-700 transition-colors group"
            >
              <LogOut size={18} className="text-rose-400 group-hover:text-rose-600 transition-colors" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
