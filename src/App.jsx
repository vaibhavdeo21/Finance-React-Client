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
  /**
   * Value of userDetails represents whether the user
   * is logged in or not.
   * null = Not logged in
   * Object = Logged in (contains user info)
   */
  const [userDetails, setUserDetails] = useState(null);

  const isUserLoggedIn = async () => {
    try{
      const response = await axios.post('http://localhost:5001/auth/is-user-logged-in',
        {}, { withCredentials: true});
      setUserDetails(response.data.user);
    } catch (error){
      console.log(error);
    }
  };

  useEffect(() => {
    isUserLoggedIn();}, []);

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