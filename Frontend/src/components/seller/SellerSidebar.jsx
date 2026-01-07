import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Plus,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  House,
  X, // Added X icon for mobile close
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "listings", label: "My Listings", icon: Building2 },
  { id: "add", label: "Add Property", icon: Plus },
  { id: "leads", label: "Leads", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

// Added isOpen and onClose props
export function SellerSidebar({ activeItem, onItemClick, isOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);

  // Helper to handle item click (close menu on mobile)
  const handleItemClick = (id) => {
    onItemClick(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border/50 bg-card transition-transform duration-300 ease-in-out",
        // Modified: Removed 'max-lg:hidden'
        // Added: logic to slide in/out on mobile, always visible on desktop (lg)
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gray-900 text-white p-2 rounded-lg w-[40px] h-[40px] flex justify-center items-center">
              <House className="font-bold" size={20} />
            </div>
            <div className="font-bold text-lg leading-tight">
              Rachna
              <br />
              Innovative
            </div>
          </Link>
        )}

        {collapsed && (
          <Link
            to="/"
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900"
          >
            <House className="h-5 w-5 text-primary-foreground" />
          </Link>
        )}
        
        {/* Mobile Close Button (Visible only on mobile) */}
        <button 
          onClick={onClose} 
          className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>

      {/* Profile Mini */}
      <div
        className={cn(
          "border-b border-border/50 p-4",
          collapsed && "flex justify-center"
        )}
      >
        <div className={cn("flex items-center gap-3", collapsed && "flex-col")}>
          <div className="relative">
            <img
              src="/assets/pravin.png"
              alt="Seller"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />
          </div>

          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                Pravin Purav
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Verified Agent
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Button (Hidden on Mobile usually, but kept for consistency) */}
      <div className="border-t border-border/50 p-3 hidden lg:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center",
            !collapsed && "justify-start"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>

        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 w-full justify-start text-muted-foreground hover:text-destructive"
            asChild
          >
            <Link to="/">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Link>
          </Button>
        )}
      </div>
      
      {/* Mobile Only Sign Out (Icon only to save space or full width if needed) */}
      <div className="border-t border-border/50 p-3 lg:hidden">
         <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            asChild
          >
            <Link to="/">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Link>
          </Button>
      </div>
    </aside>
  );
}