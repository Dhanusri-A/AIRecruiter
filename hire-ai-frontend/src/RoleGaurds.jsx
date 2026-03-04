import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export const CandidateOnly = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/candidate-signin" replace />;
  }

  if (role !== "candidate") {
    return <Navigate to="*" replace />;
  }

  return <Outlet />;
};

export const RecruiterOnly = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/recruiter-signin" replace />;
  }

  if (role !== "recruiter") {
    return <Navigate to="*" replace />;
  }

  return <Outlet />;
};
