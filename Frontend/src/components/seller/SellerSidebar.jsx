import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Plus,
  Users,
  BarChart3,
  Video,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  House,
  X,
  CircleUserRound,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const allMenuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, requiresApproval: false },
  { id: "listings", label: "My Listings", icon: Building2, requiresApproval: true },
  { id: "add", label: "Add Property", icon: Plus, requiresApproval: true },
  { id: "leads", label: "Leads", icon: Users, requiresApproval: true },
  { id: "analytics", label: "Analytics", icon: BarChart3, requiresApproval: true },
  { id: "video-calls", label: "Video Calls", icon: Video, requiresApproval: true },
  { id: "settings", label: "Settings", icon: Settings, requiresApproval: false },
];

// Added isOpen and onClose props
export function SellerSidebar({ activeItem, onItemClick, isOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const { data: seller } = useQuery({
    queryKey: ['seller', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/sellers/me');
      return data;
    },
    retry: false
  });

  const isApproved = seller?.status === 'approved';

  // Filter menu items based on approval status
  const menuItems = allMenuItems.filter(item => {
    if (item.requiresApproval && !isApproved) return false;
    return true;
  });

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
            {seller?.logoUrl ? (
              <img 
                src={seller.logoUrl} 
                alt="Company Logo" 
                className="h-10 w-10 object-cover rounded-full ring-2 ring-primary/20 bg-white" 
              />
            ) : (
              <CircleUserRound className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
            )}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />
          </div>

          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {seller?.companyName || useAuthStore.getState().user?.name || 'Seller'}
              </p>
              {isApproved ? (
                <p className="truncate text-xs text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Agent
                </p>
              ) : (
                <p className="truncate text-xs text-amber-600">
                  Pending Approval
                </p>
              )}
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
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        )}
      </div>
      
      <div className="border-t border-border/50 p-3 lg:hidden">
         <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
      </div>
    </aside>
  );
}