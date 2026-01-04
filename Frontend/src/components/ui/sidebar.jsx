import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

function SidebarProvider({ children, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

const Sidebar = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { open } = useSidebar();

    return (
      <aside
        ref={ref}
        className={cn(
          "relative flex h-full flex-col border-r bg-background transition-all",
          open ? "w-64" : "w-16",
          className
        )}
        {...props}
      />
    );
  }
);
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { open, setOpen } = useSidebar();

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", className)}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {open ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarHeader = ({ className, ...props }) => (
  <div
    className={cn("flex items-center justify-between p-4", className)}
    {...props}
  />
);

const SidebarContent = ({ className, ...props }) => (
  <div
    className={cn("flex-1 overflow-y-auto p-2", className)}
    {...props}
  />
);

const SidebarFooter = ({ className, ...props }) => (
  <div
    className={cn("border-t p-2", className)}
    {...props}
  />
);

const SidebarGroup = ({ className, ...props }) => (
  <div className={cn("mb-4", className)} {...props} />
);

const SidebarGroupLabel = ({ className, ...props }) => (
  <div
    className={cn(
      "px-2 py-1 text-xs font-medium uppercase text-muted-foreground",
      className
    )}
    {...props}
  />
);

const SidebarMenu = ({ className, ...props }) => (
  <div className={cn("space-y-1", className)} {...props} />
);

const SidebarMenuItem = React.forwardRef(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef(
  ({ className, isActive, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "ml-auto inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-muted",
        className
      )}
      {...props}
    />
  )
);
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuSub = ({ className, ...props }) => (
  <div className={cn("ml-4 space-y-1", className)} {...props} />
);

const SidebarMenuSubItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = SidebarMenuSubItem;

const SidebarRail = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { open } = useSidebar();

    if (open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-y-0 left-0 flex w-16 flex-col items-center border-r bg-background",
          className
        )}
        {...props}
      >
        <PanelLeft className="mt-4 h-5 w-5 text-muted-foreground" />
      </div>
    );
  }
);
SidebarRail.displayName = "SidebarRail";

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
};
