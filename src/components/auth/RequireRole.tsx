import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { RootState } from "../../redux/store";

/**
 * Route guard that restricts a group of routes to specific roles.
 * Role values: 1 = admin/dev, 2 = kafedra müdiri (department head).
 * Users without an allowed role are redirected to the dashboard home.
 */
export default function RequireRole({ allowedRoles }: { allowedRoles: number[] }) {
  const role = useSelector((state: RootState) => state.auth.role);

  if (role == null || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
