import { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific error when user types
    if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      setErrors({}); // Clear previous errors

      try {
        const config = { withCredentials: true };
        const response = await axios.post('http://localhost:5001/auth/register', formData, config);
        
        // Log user in immediately after registration
        setUser(response.data.user);
        
      } catch (error) {
        // Handle server errors (like "User already exists")
        const errorMsg = error.response?.data?.message || 'Registration failed';
        setErrors({ general: errorMsg });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          
          {/* THEMED CARD: Black background, Gold border, Hover effect */}
          <div className="card bg-black border-warning text-warning shadow-lg hover-effect">
            <div className="card-body p-4">
              
              <h3 className="text-center mb-4 fw-bold">CREATE ACCOUNT</h3>

              {/* General Error Alert */}
              {errors.general && (
                  <div className="alert alert-danger bg-dark text-danger border-danger text-center">
                      {errors.general}
                  </div>
              )}

              <form onSubmit={handleFormSubmit}>
                
                {/* Name Field */}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input 
                    className="form-control bg-dark text-warning border-secondary"
                    type='text' 
                    name="name" 
                    placeholder="Enter your name"
                    onChange={handleChange} 
                  />
                  {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                </div>

                {/* Email Field */}
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

                {/* Password Field */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input 
                    className="form-control bg-dark text-warning border-secondary"
                    type='password' 
                    name="password" 
                    placeholder="Create a password"
                    onChange={handleChange} 
                  />
                  {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                </div>

                {/* Submit Button with Loading State */}
                <div className="d-grid mt-4">
                  <button className="btn btn-warning fw-bold" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Account...' : 'Register Now'}
                  </button>
                </div>

              </form>
              
              <hr className="border-warning my-4" />
              
              {/* Footer Link - Centered and Visible */}
              <div className="d-flex justify-content-center align-items-center">
                <span className="text-white-50 me-2">Already have an account?</span>
                <Link to="/login" className="text-warning fw-bold text-decoration-none">
                    Login here
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;