import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ userRole }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar userRole={userRole} />
      <main className="ml-64">
        <Outlet />
      </main>
    </div>
  );
}
