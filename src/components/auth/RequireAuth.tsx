import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { RootState } from "../../redux/store";

export default function RequireAuth() {
  const token = useSelector((state: RootState) => state.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
