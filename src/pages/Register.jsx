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
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;
    
    if (!formData.name) { newErrors.name = "Name is required"; isValid = false; }
    if (!formData.email) { newErrors.email = "Email is required"; isValid = false; }
    if (!formData.password) { newErrors.password = "Password is required"; isValid = false; }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    if (validate()) {
      try {
        const config = { withCredentials: true };
        
        // Call the Register API
        const response = await axios.post('http://localhost:5001/auth/register', formData, config);
        
        console.log(response);
        setMessage('Registration successful!');
        
        // UPDATE STATE: Log the user in immediately
        setUser(response.data.user);
        
      } catch (error) {
        console.log(error);
        // Handle "User already exists" or other server errors
        const errorMsg = error.response?.data?.message || 'Something went wrong';
        setErrors({ message: errorMsg });
      }
    } else {
      console.log('Invalid Form');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-4">Create Account</h3>

              {message && <div className="alert alert-success">{message}</div>}
              {errors.message && <div className="alert alert-danger">{errors.message}</div>}

              <form onSubmit={handleFormSubmit}>
                {/* Name Field */}
                <div className="mb-3">
                  <label className="form-label">Name:</label>
                  <input 
                    className="form-control" 
                    type='text' 
                    name="name" 
                    onChange={handleChange} 
                  />
                  {errors.name && <div className="text-danger small">{errors.name}</div>}
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input 
                    className="form-control" 
                    type='text' 
                    name="email" 
                    onChange={handleChange} 
                  />
                  {errors.email && <div className="text-danger small">{errors.email}</div>}
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <label className="form-label">Password:</label>
                  <input 
                    className="form-control" 
                    type='password' 
                    name="password" 
                    onChange={handleChange} 
                  />
                  {errors.password && <div className="text-danger small">{errors.password}</div>}
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-primary">Register</button>
                </div>
              </form>
              
              <div className="text-center mt-3">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;