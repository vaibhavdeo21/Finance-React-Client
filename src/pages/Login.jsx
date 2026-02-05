import { useState } from "react";
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";
import { useDispatch } from 'react-redux';
import { SET_USER } from "../redux/user/action";

function Login() {
  const dispatch = useDispatch();
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const config = { withCredentials: true };
        const response = await axios.post(`${serverEndpoint}/auth/login`, formData, config);
        dispatch({ type: SET_USER, payload: response.data.user });
      } catch (error) {
        setErrors({ general: error.response?.data?.message || 'Login failed' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSuccess = async (authResponse) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`, 
        { idToken: authResponse.credential },
        { withCredentials: true }
      );
      dispatch({ type: SET_USER, payload: response.data.user });
    } catch (error) {
      console.log(error);
      setErrors({ general: 'Google Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card bg-white border-0 shadow-lg rounded-4">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 fw-bold text-dark">Login</h3>
              
              {errors.general && <div className="alert alert-danger">{errors.general}</div>}

              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Email Address</label>
                  <input
                    className="form-control"
                    type='text'
                    name="email"
                    placeholder="name@example.com"
                    autoComplete="username"
                    onChange={handleChange}
                  />
                  {errors.email && <div className="text-danger small">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Password</label>
                  <input
                    className="form-control"
                    type='password'
                    name="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    onChange={handleChange}
                  />
                  {errors.password && <div className="text-danger small">{errors.password}</div>}
                </div>

                <div className="d-grid mt-4">
                  <button className="btn btn-primary fw-bold" disabled={isSubmitting}>
                    {isSubmitting ? 'Accessing...' : 'Login'}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1 text-muted" />
                <span className="mx-3 text-muted small fw-bold">OR</span>
                <hr className="flex-grow-1 text-muted" />
              </div>

              {/* Google Social Login */}
              <div className="d-flex justify-content-center w-100">
                 <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <GoogleLogin 
                      onSuccess={handleGoogleSuccess} 
                      onError={() => console.log('Login Failed')}
                      theme="outline"
                      shape="pill"
                      text="signin_with"
                      width="500"
                    />
                 </GoogleOAuthProvider>
              </div>

              <div className="text-center mt-4">
                <span className="text-muted">New here? </span>
                <Link to="/register" className="text-primary fw-bold text-decoration-none">
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