// import Container from "react-bootstrap/Container";
// function App() {
//   return (
//     <>
//     <div className="container">
//       <h1 className="text-center">Welcome To Finance App</h1>
//     </div>

//     <Container>
//       <h1 className="text-center">Welcome to Finance App</h1>
//     </Container>
//     </>
//   );
// }

// export default App;

import {Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import AppLayout from "./components/AppLayout";
import { useState } from "react";


function App() {
  /**Value of userDetails represents whether user
   * is logged in or not
   */
  const [userDetails, setUserDetails] = useState(null);

  return (
    <Routes>
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
              <Login setUser={setUserDetails} />
            </AppLayout>
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          userDetails ? (
            <Dashboard user={userDetails} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;