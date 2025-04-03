import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";

const AuthRoute = () => {
  const location = useLocation();
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;
  console.log("🚀 ~ AuthRoute ~ user:", user);
  const isAuth = isAuthRoute(location.pathname);
  if (isLoading && !isAuth) return <DashboardSkeleton />;
  if (!user) return <Outlet />;
  return <Navigate to={`workspace/${user?.currentWorkspace?._id}`} replace />;
};

export default AuthRoute;
