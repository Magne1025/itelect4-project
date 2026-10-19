import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";
import { UserRole } from "../types/index";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

/**
 * Route guard: renders child routes when authenticated,
 * redirects to /login when token is null.
 * Also checks if the user's role is in the allowedRoles array.
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, user } = useAuthStore();

  if (token === null || user === null) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not allowed, redirect to items
    return <Navigate to="/items" replace />;
  }

  return <Outlet />;
}
