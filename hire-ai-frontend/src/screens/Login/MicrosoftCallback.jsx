import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const MicrosoftCallback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

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
      const decodedToken = decodeJWT(token);
      console.log('Decoded Microsoft token:', decodedToken);
      
      if (!decodedToken) {
        toast.error("Invalid token");
        navigate("/recruiter-signin", { replace: true });
        return;
      }
      
      const userData = {
        access_token: token,
        token_type: "bearer",
        user: {
          id: decodedToken.sub,
          email: decodedToken.email,
          username: decodedToken.email?.split('@')[0],
          full_name: decodedToken.email?.split('@')[0],
          role: decodedToken.role?.toLowerCase() || "recruiter",
          is_active: true
        }
      };
      
      console.log('Microsoft user data:', userData);
      login(userData);
      toast.success("Signed in with Microsoft successfully!");
      
      window.location.href = "/recruiter";
    } else if (error) {
      toast.error(`Microsoft login failed: ${error}`);
      navigate("/recruiter-signin", { replace: true });
    } else {
      toast.error("Invalid callback");
      navigate("/recruiter-signin", { replace: true });
    }
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Completing Microsoft sign in...</p>
      </div>
    </div>
  );
};

export default MicrosoftCallback;
