import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { isAdminRole } from "./role";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { isLoggedIn, loading, role } = useUser();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdminRole(role)) {
    return <Navigate to="/dashboard/overview" replace />;
  }

  if (!requireAdmin && isAdminRole(role)) {
    return <Navigate to="/dashboard/admin/overview" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
