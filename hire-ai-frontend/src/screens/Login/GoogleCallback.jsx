import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const GoogleCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Function to decode JWT token
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (token) {
      // Decode JWT to get user info
      const decodedToken = decodeJWT(token);
      
      const userData = {
        access_token: token,
        token_type: "bearer",
        user: {
          id: decodedToken?.sub,
          email: decodedToken?.email,
          role: decodedToken?.role?.toLowerCase() || "recruiter",
          full_name: decodedToken?.full_name || decodedToken?.name || decodedToken?.email?.split('@')[0]

        }
      };
      
      // Update auth context and localStorage synchronously
      login(userData);
      toast.success("Signed in with Google successfully!");
      
      // Navigate immediately - auth state is already updated in localStorage
      window.location.href = "/recruiter";
    } else if (error) {
      toast.error(`Google login failed: ${error}`);
      navigate("/recruiter-signin", { replace: true });
    } else {
      toast.error("Invalid callback");
      navigate("/recruiter-signin", { replace: true });
    }
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;