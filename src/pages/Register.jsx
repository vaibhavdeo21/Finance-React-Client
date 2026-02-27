import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; // Added import
import { serverEndpoint } from "../config/appConfig";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/action";

function Register() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axios.post(`${serverEndpoint}/auth/register`, formData);
            navigate("/login"); 
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (authResponse) => {
        try {
            const body = { idToken: authResponse?.credential };
            const response = await axios.post(
                `${serverEndpoint}/auth/google-auth`,
                body,
                { withCredentials: true }
            );
            dispatch({
                type: SET_USER,
                payload: response.data.user,
            });
            // Google SSO handles both login/register, so we redirect to dashboard
            navigate("/dashboard");
        } catch (error) {
            setError("Unable to process Google Sign Up, please try again");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-dark">
                                    Get <span className="text-primary">Started</span>
                                </h2>
                                <p className="text-muted small">
                                    Create an account to manage your MergeMoney groups
                                </p>
                            </div>

                            {error && (
                                <div className="alert alert-danger py-2 small border-0 shadow-sm mb-4">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg rounded-3 fs-6 shadow-none" 
                                        placeholder="John Doe" 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-secondary">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control form-control-lg rounded-3 fs-6 shadow-none" 
                                        placeholder="name@example.com" 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-secondary">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control form-control-lg rounded-3 fs-6 shadow-none" 
                                        placeholder="••••••••" 
                                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                        required 
                                    />
                                </div>
                                
                                <div className="d-flex flex-column align-items-center">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 btn-md rounded-pill fw-bold shadow-sm mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating Account..." : "Sign Up"}
                                    </button>
                                </div>
                            </form>

                            {/* Divider */}
                            <div className="d-flex align-items-center my-2">
                                <hr className="flex-grow-1 text-muted" />
                                <span className="mx-3 text-muted small fw-bold">OR</span>
                                <hr className="flex-grow-1 text-muted" />
                            </div>

                            {/* Google Social Sign Up */}
                            <div className="d-flex justify-content-center w-100 mb-4">
                                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setError("Google Sign Up failed")}
                                        theme="outline"
                                        shape="pill"
                                        text="signup_with" // Changed from signin_with to signup_with
                                        width="500"
                                    />
                                </GoogleOAuthProvider>
                            </div>

                            <p className="text-center small text-muted mb-0">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary fw-bold text-decoration-none">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;