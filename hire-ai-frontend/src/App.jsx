import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AutoRedirect from "./AutoRedirect";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AutoRedirect />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
