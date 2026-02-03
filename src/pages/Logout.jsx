import axios from "axios";
import { useEffect } from "react";
import { serverEndpoint } from "../config/appConfig";

function Logout({ setUser }) {
  
  const handleLogout = async () => {
    try {
      // 1. POST request to server to clear cookie
      await axios.post(
        `${serverEndpoint}/auth/logout`,
        {}, 
        { withCredentials: true }
      );

      // 2. Clear client-side cookie manually (Backup)
      document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // 3. Update State
      setUser(null);
      
    } catch (error) {
      console.log(error);
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