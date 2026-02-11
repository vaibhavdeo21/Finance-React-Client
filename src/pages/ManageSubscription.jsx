import axios from "axios";
import { useEffect, useState } from "react";
import { serverEndpoint } from "../config/appConfig";

const PLAN_IDS = {
    UNLIMITED_MONTHLY: {
        price: 5,
        planName: 'Unlimited Monthly',
        frequency: 'monthly'
    },
    UNLIMITED_YEARLY: {
        price: 50,
        planName: 'Unlimited Yearly',
        frequency: 'yearly'
    }
};

function ManageSubscription() {
    const [userProfile, setUserProfile] = useState(null);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserProfile = async () => {
        try {
            const response = await axios.get(
                `${serverEndpoint}/profile/get-user-info`,
                { withCredentials: true }
            );
            setUserProfile(response.data.user);
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to fetch subscription data" });
        } finally {
            setLoading(false);
        }
    };

    // Handler to initiate subscription (You will connect this to backend next)
    const handleSubscribe = async (planKey) => {
        alert(`Subscribe logic for ${PLAN_IDS[planKey].planName} coming next!`);
        // Logic to call /create-subscription endpoint will go here
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    if (loading) {
        return (
            <div className="container p-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 px-4">
            <h2 className="fw-bold mb-4">Manage Subscription</h2>

            {errors.message && (
                <div className="alert alert-danger" role="alert">
                    {errors.message}
                </div>
            )}
            {message && (
                <div className="alert alert-success" role="alert">
                    {message}
                </div>
            )}

            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Current Plan</h5>
                    
                    {userProfile?.subscription?.status === 'active' ? (
                        <div className="alert alert-success d-flex align-items-center">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            <div>
                                <strong>Active</strong> - {userProfile.subscription.planId}
                                <br/>
                                <small>Next billing date: {new Date(userProfile.subscription.nextBillDate).toLocaleDateString()}</small>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted">You do not have an active subscription.</p>
                    )}

                    {/* Subscription Options - Only show if not active */}
                    {(!userProfile?.subscription?.status || userProfile?.subscription?.status !== 'active') && (
                        <div className="row mt-4">
                            {Object.keys(PLAN_IDS).map((key) => (
                                <div className="col-md-6 mb-3" key={key}>
                                    <div className="card h-100 border-primary-subtle shadow-sm">
                                        <div className="card-body text-center p-4">
                                            <h4 className="fw-bold text-primary">{PLAN_IDS[key].planName}</h4>
                                            <h2 className="my-3 display-6 fw-bold">₹{PLAN_IDS[key].price}<small className="fs-6 text-muted">/{PLAN_IDS[key].frequency}</small></h2>
                                            <button 
                                                className="btn btn-primary w-100 rounded-pill fw-bold"
                                                onClick={() => handleSubscribe(key)}
                                            >
                                                Subscribe Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManageSubscription;