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
import { serverEndpoint } from "./config/appConfig";

function App() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/is-user-logged-in`,
        {}, 
        { withCredentials: true }
      );
      setUserDetails(response.data.user);
    } catch (error) {
      console.log("User not logged in");
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
        <h3 className="text-warning">Loading...</h3>
      </div>
    );
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={ userDetails ? <Navigate to="/dashboard" /> : <AppLayout><Home /></AppLayout> } />
      <Route path="/register" element={ userDetails ? <Navigate to="/dashboard" /> : <AppLayout><Register setUser={setUserDetails} /></AppLayout> } />
      <Route path="/login" element={ userDetails ? <Navigate to="/dashboard" /> : <AppLayout><Login setUser={setUserDetails} /></AppLayout> } />

      {/* PRIVATE ROUTES */}
      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <UserLayout user={userDetails}>
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