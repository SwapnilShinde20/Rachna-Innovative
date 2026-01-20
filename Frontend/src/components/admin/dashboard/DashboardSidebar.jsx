import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import { cn } from "../../../lib/utils";
import {
  Home,
  Users,
  Video,
  Calendar,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  UserCheck,
  DollarSign,
  Star,
  Layout,
} from "lucide-react";
import { Button } from "../../../components/admin/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/admin/ui/collapsible";
import { useState } from "react";

const adminNavItems = [
  { label: "Dashboard", icon: Home, href: "/admin" },
  { label: "Sellers", icon: UserCheck, href: "/admin/sellers" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Transactions", icon: DollarSign, href: "/admin/transactions" },
  { label: "Reviews", icon: Star, href: "/admin/reviews" },
  { label: "Video Calls", icon: Video, href: "/admin/video-calls" },
  { label: "Meetings", icon: Calendar, href: "/admin/meetings" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  {
    label: "CMS",
    icon: Layout,
    children: [
      { label: "All Posts", href: "/admin/cms/blogs" },
      { label: "Add Post", href: "/admin/cms/blogs/new" },
      { label: "Categories", href: "/admin/cms/blog-categories" },
      { label: "Tags", href: "/admin/cms/blog-tags" },
      { label: "Media", href: "/admin/cms/media" },
    ],
  },
  { label: "Notifications", icon: Bell, href: "/admin/notifications" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [openMenus, setOpenMenus] = useState(["CMS"]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const toggleMenu = (label) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Home className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <span className="font-bold text-sidebar-foreground">Rachna</span>
          <span className="text-xs text-muted-foreground block -mt-1">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <ul className="space-y-1">
          {adminNavItems.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <Collapsible
                  open={openMenus.includes(item.label)}
                  onOpenChange={() => toggleMenu(item.label)}
                >
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          openMenus.includes(item.label) && "rotate-180"
                        )}
                      />
                    </button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pl-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className={({ isActive }) =>
                          cn(
                            "block px-3 py-2 rounded-lg text-sm",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-sidebar-accent"
                          )
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <NavLink
                  to={item.href}
                  end={item.href === "/admin"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-sidebar-accent"
                    )
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
