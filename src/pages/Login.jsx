import { useState } from "react";
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;
    
    if (formData.email.length === 0) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    
    if (formData.password.length === 0) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async (event) => {
    // Prevent default behaviour of form which is to do complete page reload.
    event.preventDefault();
    
    if (validate()) {
      try {
        const body = {
          email: formData.email,
          password: formData.password,
        };
        const config = { withCredentials: true };
        
        // Sending request to Backend
        const response = await axios.post('http://localhost:5001/auth/login', body, config);
        
        console.log(response);
        setMessage('User authenticated');
      } catch (error) {
        console.log(error);
        setErrors({
          message: 'Something went wrong, please try again'
        });
      }
    } else {
      console.log('Invalid Form');
    }
  };

  return (
    <div className="container text-center">
      <h3>Login to continue</h3>
      
      {message && <div className="alert alert-success">{message}</div>}
      {errors.message && <div className="alert alert-danger">{errors.message}</div>}

      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Email:</label>
          <input
            className="form-control"
            type='text'
            name="email"
            onChange={handleChange}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        <div>
          <label>Password:</label>
          <input
            className="form-control"
            type='password'
            name="password"
            onChange={handleChange}
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>

        <div className="mt-3">
          <button className="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;