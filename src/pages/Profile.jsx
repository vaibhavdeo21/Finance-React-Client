import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { SET_USER } from "../redux/user/action";

function Profile() {
    const user = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const [name, setName] = useState(user?.name || "");
    const [status, setStatus] = useState({ type: "", msg: "" });

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${serverEndpoint}/profile/update`, { name }, { withCredentials: true });
            dispatch({ type: SET_USER, payload: res.data.user });
            setStatus({ type: "success", msg: res.data.message });
        } catch (err) {
            setStatus({ type: "danger", msg: "Failed to update profile" });
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm border-0 rounded-4 p-4">
                        <h3 className="fw-bold mb-4">Edit <span className="text-primary">Profile</span></h3>
                        {status.msg && <div className={`alert alert-${status.type} small py-2`}>{status.msg}</div>}
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Full Name</label>
                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold">Email Address</label>
                                <input type="text" className="form-control bg-light" value={user?.email} disabled />
                                <small className="text-muted">Email cannot be changed.</small>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;