import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";

export function ProtectedRoute({ children, allowedRoles, redirectTo = "/login" }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is logged in but role doesn't match, maybe redirect to their own dashboard or 403
    // For now, let's redirect to the login page or entry point
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

