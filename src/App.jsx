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
// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import { SET_USER } from "./redux/user/action";
// Groups Import
import Groups from "./pages/Groups";

function App() {
  const dispatch = useDispatch();
  
  // We need to take out userDetails since we're interested in userDetails object.
  const userDetails = useSelector((state) => state.userDetails);
  const [loading, setLoading] = useState(true);

  const isUserLoggedIn = async () => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/is-user-logged-in`,
        {}, 
        { withCredentials: true }
      );
      
      // Dispatch to Redux Store instead of local state
      dispatch({
        type: SET_USER,
        payload: response.data.user
      });
    } catch (error) {
      console.log(error);
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
      <Route path="/register" element={ userDetails ? <Navigate to="/dashboard" /> : <AppLayout><Register /></AppLayout> } />
      <Route path="/login" element={ userDetails ? <Navigate to="/dashboard" /> : <AppLayout><Login /></AppLayout> } />

      {/* PRIVATE ROUTES (No more prop drilling) */}
      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <UserLayout>
              <Dashboard />
            </UserLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/groups"
        element={
          userDetails ? (
            <UserLayout>
              <Groups />
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
            <Logout />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;