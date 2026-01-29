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

import {Route, Routes} from "react-router-dom";

function App(){
  return (
    <Routes>
      <Route path="/" element={Home}/>
      <ROute path="/login" element={Login}/>
    </Routes>
  );
}

export default App;