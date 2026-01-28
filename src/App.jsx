// We import the child components so we can place them on the screen.
import Student from "./pages/Student";
import Student1 from "./pages/Student1";
import Student2 from "./pages/Student2";
import Student3 from "./pages/Student3";
import StudentList from "./pages/StudentList";

function App() {
  return (
    
    <>
      <h1>Welcome To Finance App</h1>
      
      {/* 1. Renders Student.jsx (It has its own internal data "Tommy") */}
      <Student />
      
      {/* 2. Renders Student1.jsx WITHOUT data. 
          It will use the Default Props: Name="Pluto", Roll=8 */}
      <Student1></Student1>
      
      {/* 3. Renders Student1.jsx WITH data.
          It will overwrite the defaults with Name="Stuart", Roll=21 */}
      <Student1 name="Stuart" rollNumber={21}></Student1>
    
    </>
  );
}

export default App;