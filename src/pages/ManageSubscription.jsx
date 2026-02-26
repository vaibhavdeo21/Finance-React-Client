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

    // Handler for successful Razorpay payment [cite: 1705, 1733]
    const rzpResponseHandler = async (response) => {
        try {
            setLoading(true);
            const captureSubsResponse = await axios.post(
                `${serverEndpoint}/payments/capture-subscription`,
                { subscriptionId: response.razorpay_subscription_id },
                { withCredentials: true }
            );
            setUserProfile(captureSubsResponse.data.user);
            setMessage("Subscription activated successfully!");
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to capture subscription details, contact customer service" });
        } finally {
            setLoading(false);
        }
    };

    // Logic to initiate Razorpay subscription checkout 
    const handleSubscribe = async (planKey) => {
        try {
            setLoading(true);
            const createSubscriptionResponse = await axios.post(
                `${serverEndpoint}/payments/create-subscription`,
                { plan_name: planKey },
                { withCredentials: true }
            );

            const subscription = createSubscriptionResponse.data.subscription;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure this is in your .env
                name: PLAN_IDS[planKey].planName,
                description: `Pay INR ${PLAN_IDS[planKey].price} ${PLAN_IDS[planKey].frequency}`,
                subscription_id: subscription.id,
                theme: { color: '#3399cc' },
                handler: (response) => { rzpResponseHandler(response); },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to process subscription request' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    // Derived logic to check if user needs to see subscription options 
    const notSubscribedStatus = [undefined, 'completed', 'cancelled'];
    const showSubscription = notSubscribedStatus.includes(userProfile?.subscription?.status);

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
                    <h5 className="fw-bold mb-3">Current Status</h5>
                    
                    {/* View for active/authenticated users  */}
                    {!showSubscription && userProfile?.subscription && (
                        <div className="alert alert-success">
                            <div className="row">
                                <div className="col-md-6">
                                    <strong>Plan ID:</strong> {userProfile.subscription.planId} <br/>
                                    <strong>Subscription ID:</strong> {userProfile.subscription.subscriptionId}
                                </div>
                                <div className="col-md-6">
                                    <strong>Status:</strong> <span className="text-uppercase">{userProfile.subscription.status}</span> <br/>
                                    <strong>Next Billing:</strong> {userProfile.subscription.nextBillDate ? new Date(userProfile.subscription.nextBillDate).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    )}

                    {showSubscription && (
                        <p className="text-muted">You do not have an active subscription. Choose a plan below to get started.</p>
                    )}

                    {/* Show Plan Cards only if user is not currently subscribed  */}
                    {showSubscription && (
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