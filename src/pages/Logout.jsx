import axios from "axios";
import { useEffect } from "react";
import { serverEndpoint } from "../config/appConfig";
import { useDispatch } from 'react-redux';
import { CLEAR_USER } from "../redux/user/action";

function Logout() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(`${serverEndpoint}/auth/logout`, {}, { withCredentials: true });
      document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Dispatch to Redux
      dispatch({
        type: CLEAR_USER
      });

    } catch (error) {
      console.log(error);
      // Even on error, clear state
      dispatch({ type: CLEAR_USER });
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