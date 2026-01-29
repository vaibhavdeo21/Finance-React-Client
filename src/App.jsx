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

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout>
            <Home />
          </AppLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AppLayout>
            <Login />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;