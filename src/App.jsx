import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import AppLayout from "./components/AppLayout";
import UserLayout from "./components/UserLayout";
import axios from "axios";

function App() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5001/auth/is-user-logged-in',
        {}, 
        { withCredentials: true }
      );
      setUserDetails(response.data.user);
    } catch (error) {
      // FIX: Check if the error is 401 (Unauthorized)
      if (error.response && error.response.status === 401) {
        // This is normal if the user is not logged in. 
        // We do nothing here, or just set user to null silently.
        console.log("User not logged in (Session inactive)");
      } else {
        // Only log REAL errors (like server down or network issues)
        console.error("Error checking login status:", error);
      }
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isUserLoggedIn();
  }, []);
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="text-warning mt-3">Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      
      <Route
        path="/"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout>
              <Home />
            </AppLayout>
          )
        }
      />

      <Route
        path="/register"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout>
              {/* Pass setUser so Register can update the global state */}
              <Register setUser={setUserDetails} />
            </AppLayout>
          )
        }
      />

      <Route
        path="/login"
        element={
          userDetails ? (
            <Navigate to="/dashboard" />
          ) : (
            <AppLayout>
              {/* We pass setUser function to Login so it can update the state */}
              <Login setUser={setUserDetails} />
            </AppLayout>
          )
        }
      />

      {/* --- PRIVATE ROUTES --- */}

      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <UserLayout>
              <Dashboard user={userDetails} />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/logout"
        element={
          userDetails ? (
            <Logout setUser={setUserDetails} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;