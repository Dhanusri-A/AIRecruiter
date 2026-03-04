import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import FullScreenLoader from "./components/FullScreenLoader";

const AutoRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const path = location.pathname;

    const authRoutes = [
      "/",
      "/candidate-signin",
      "/candidate-signup",
      "/recruiter-signin",
      "/recruiter-signup",
    ];

    if (isAuthenticated && authRoutes.includes(path)) {
      navigate(role === "recruiter" ? "/recruiter" : "/candidate", {
        replace: true,
      });
      return;
    }

    if (!isAuthenticated && !authRoutes.includes(path)) {
      if (path.startsWith("/recruiter")) {
        navigate("/recruiter-signin", { replace: true });
        return;
      }

      if (path.startsWith("/candidate")) {
        navigate("/candidate-signin", { replace: true });
        return;
      }
    }
  }, [isAuthenticated, role, loading, location.pathname, navigate]);

  // 🛑 BLOCK rendering while loading
  if (loading) {
    return <FullScreenLoader />;
  }

  return null;
};

export default AutoRedirect;
