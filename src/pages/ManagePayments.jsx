import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function ManagePayments() {
    const [errors, setErrors] = useState({});

    const getUserProfile = async () => {
        try {
            const response = await axios.get(
                `${serverEndpoint}/profile/get-user-info`,
                { withCredentials: true }
            );
            setUserProfile(response.data.user);
        } catch (error) {
            console.log(error);
            setErrors({ fetch: "Failed to fetch user profile" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    if (loading) {
        return (
            <div className="container p-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading....</span>
                </div>
            </div>
        );
    }
    return (
        <div className="container p-5">
            {errors.message && (
                <div className="alert-danger" role="alert">
                    {errors.message}
                </div>
            )}

            
        </div>
    );
}
export default ManagePayments;