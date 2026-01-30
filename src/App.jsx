import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import AppLayout from "./components/AppLayout";
import UserLayout from "./components/UserLayout";

function App() {
  /**
   * Value of userDetails represents whether the user
   * is logged in or not.
   * null = Not logged in
   * Object = Logged in (contains user info)
   */
  const [userDetails, setUserDetails] = useState(null);

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