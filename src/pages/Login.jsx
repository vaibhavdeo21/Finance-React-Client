import { useState } from "react";
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig"; // IMPORT THIS

function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- MANUAL LOGIN ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const config = { withCredentials: true };
        // UPDATED: Use serverEndpoint
        const response = await axios.post(`${serverEndpoint}/auth/login`, formData, config);
        setUser(response.data.user); 
      } catch (error) {
        // This line catches "Please log in using Google SSO" from the backend
        setErrors({ general: error.response?.data?.message || 'Login failed' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // --- GOOGLE LOGIN ---
  const handleGoogleSuccess = async (authResponse) => {
    try {
      setIsSubmitting(true);
      const idToken = authResponse.credential;

      // UPDATED: Use serverEndpoint
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`, 
        { idToken: idToken },
        { withCredentials: true }
      );

      setUser(response.data.user);

    } catch (error) {
      console.log(error);
      setErrors({ general: 'Google Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleFailure = (error) => {
      console.log("Google Login Error:", error);
      setErrors({ general: "Google Sign-In was unsuccessful." });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card bg-black border-warning text-warning shadow-lg hover-effect">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 fw-bold">LOGIN</h3>
              
              {/* ERROR ALERT */}
              {errors.general && (
                  <div className="alert alert-danger bg-dark text-danger border-danger">
                      {errors.general}
                  </div>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-control bg-dark text-warning border-secondary"
                    type='text'
                    name="email"
                    placeholder="name@example.com" 
                    onChange={handleChange}
                  />
                  {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    className="form-control bg-dark text-warning border-secondary"
                    type='password'
                    name="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                  {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                </div>

                <div className="d-grid mt-4">
                  <button className="btn btn-warning fw-bold" disabled={isSubmitting}>
                    {isSubmitting ? 'Accessing...' : 'Access Dashboard'}
                  </button>
                </div>
              </form>

              {/* GOOGLE BUTTON */}
              <div className="d-flex justify-content-center mt-4">
                 <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <GoogleLogin 
                      onSuccess={handleGoogleSuccess} 
                      onError={handleGoogleFailure} 
                      theme="filled_black" 
                      shape="pill"         
                    />
                 </GoogleOAuthProvider>
              </div>

              <hr className="border-warning my-4" />

              <div className="d-flex justify-content-center align-items-center">
                <span className="text-white-50 me-2">New here?</span>
                <Link to="/register" className="text-warning fw-bold text-decoration-none">
                    Create Account
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;