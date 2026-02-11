import { useEffect, useState } from "react";
import axios from 'axios';
import { serverEndpoint } from '../config/appConfig';

const CREDITS_PACK = [
    { price: 1, credits: 10 },
    { price: 4, credits: 50 },
    { price: 7, credits: 100 }
];

function ManagePayments() {
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null); // [cite: 19]
    const [userProfile, setUserProfile] = useState(null);
    const [selectedCredits, setSelectedCredits] = useState(null);

    const getUserProfile = async () => {
        try {
            const response = await axios.get(
                `${serverEndpoint}/profile/get-user-info`,
                { withCredentials: true }
            );
            setUserProfile(response.data.user);
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to fetch user profile' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    // Verification handler after successful Razorpay payment [cite: 19, 343]
    const paymentResponseHandler = async (credits, payment) => {
        try {
            const response = await axios.post(
                `${serverEndpoint}/payments/verify-order`,
                {
                    razorpay_order_id: payment.razorpay_order_id,
                    razorpay_payment_id: payment.razorpay_payment_id,
                    razorpay_signature: payment.razorpay_signature,
                    credits: credits // [cite: 26]
                },
                { withCredentials: true }
            );
            setUserProfile(response.data.user);
            setMessage(`Payment success, ${credits} credits are credited to your account`); // [cite: 26]
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to process payment request, contact customer service' });
        }
    };

    const handlePayment = async (credits) => {
        try {
            setLoading(true);
            const orderResponse = await axios.post(
                `${serverEndpoint}/payments/create-order`,
                { credits: credits },
                { withCredentials: true }
            );

            const order = orderResponse.data.order;
            setSelectedCredits(credits);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'MergeMoney',
                description: `Order for purchasing ${credits} credits`,
                order_id: order.id,
                theme: {
                    color: '#3399cc'
                },
                // Updated handler to pass credits [cite: 26]
                handler: (response) => { paymentResponseHandler(credits, response) }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to process the payment request' });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container p-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container p-5">
            {errors.message && (
                <div className="alert alert-danger" role="alert">
                    {errors.message}
                </div>
            )}

            {/* Added success message alert [cite: 26] */}
            {message && (
                <div className="alert alert-success" role="alert">
                    {message}
                </div>
            )}

            <h2>Manage Payments</h2>
            <p><strong>Current Credit Balance: </strong>{userProfile.credits || 0}</p>

            <div className="row g-4 mt-2"> {/* g-4 adds consistent spacing between cards */}
                {CREDITS_PACK.map((credit, index) => (
                    <div key={index} className="col-12 col-md-4">
                        <div className="card h-100 border shadow-sm rounded-4 text-center p-4">
                            <h4 className="fw-bold">{credit.credits} Credits</h4>
                            <p className="text-muted small">Buy {credit.credits} Credits for INR {credit.price}</p>
                            <button
                                className="btn btn-outline-primary rounded-pill w-100 mt-auto"
                                onClick={() => { handlePayment(credit.credits); }}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManagePayments;