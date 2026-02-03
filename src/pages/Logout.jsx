import axios from "axios";
import { useEffect } from "react";
import { serverEndpoint } from "../config/appConfig";

function Logout({ setUser }) {
  
  const handleLogout = async () => {
    try {
      // 1. Tell Server to delete cookie
      await axios.post(
        `${serverEndpoint}/auth/logout`,
        {}, 
        { withCredentials: true }
      );

      // 2. Force clear client-side cookie (Backup)
      document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // 3. Update State to null (Redirects to Login)
      setUser(null);
      
    } catch (error) {
      console.log(error);
      // Even if server fails, we clear state to log user out locally
      setUser(null);
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
        <h3 className="text-warning">Logging out...</h3>
    </div>
  );
}

export default Logout;