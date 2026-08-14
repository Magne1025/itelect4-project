import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";

/**
 * Route guard: renders child routes when authenticated,
 * redirects to /login when token is null.
 */
export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);

  if (token === null) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
