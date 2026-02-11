import { useEffect, useState } from "react";
import { serverEndpoint } from "../config/appConfig";
import axios from "axios";
import Can from "../components/Can";

function ManageUsers() {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Select",
    });

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/users/`, {
                withCredentials: true,
            });
            setUsers(response.data.users);
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to fetch users, please try again" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let isValid = true;
        let newErrors = {};

        if (formData.name.length === 0) {
            isValid = false;
            newErrors.name = "Name is required";
        }
        if (formData.email.length === 0) {
            isValid = false;
            newErrors.email = "Email is required";
        }
        if (formData.role === "Select") {
            isValid = false;
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setActionLoading(true);
            try {
                const response = await axios.post(
                    `${serverEndpoint}/users/`,
                    {
                        name: formData.name,
                        email: formData.email,
                        role: formData.role,
                    },
                    { withCredentials: true }
                );
                setUsers([...users, response.data.user]);
                setMessage("User added!");
                setFormData({ name: "", email: "", role: "Select" });
                // Auto-clear message
                setTimeout(() => setMessage(null), 3000);
            } catch (error) {
                console.log(error);
                setErrors({ message: "Unable to add user, please try again" });
            } finally {
                setActionLoading(false);
            }
        }
    };

    // NEW: Handle Delete Functionality
    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to remove this user?")) return;
        
        try {
            await axios.delete(`${serverEndpoint}/users/${userId}`, {
                withCredentials: true,
            });
            setUsers(users.filter(u => u._id !== userId));
            setMessage("User removed successfully");
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.log(error);
            setErrors({ message: "Failed to delete user" });
        }
    };

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
        <div className="container py-5 px-4 px-md-5">
            {errors.message && (
                <div className="alert alert-danger border-0 shadow-sm mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errors.message}
                </div>
            )}
            {message && (
                <div className="alert alert-success border-0 shadow-sm mb-4" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {message}
                </div>
            )}

            <div className="row align-items-center mb-5">
                <div className="col-md-8 text-center text-md-start mb-3 mb-md-0">
                    <h2 className="fw-bold text-dark display-6">
                        Manage <span className="text-primary">Users</span>
                    </h2>
                    <p className="text-muted mb-0">
                        View and manage all the users along with their permissions
                    </p>
                </div>
            </div>

            <div className="row g-4">
                {/* Add user form - Protected by RBAC */}
                <Can requiredPermission="canCreateUsers">
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 rounded-4">
                            <div className="card-header bg-white border-0 pt-4 px-4">
                                <h5 className="fw-bold mb-0">Add Member</h5>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary text-uppercase mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter name"
                                            className={
                                                errors.name
                                                    ? "form-control form-control-lg bg-light border-0 is-invalid fs-6"
                                                    : "form-control form-control-lg bg-light border-0 fs-6"
                                            }
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback ps-1">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-secondary text-uppercase mb-2">Email</label>
                                        <input
                                            type="text"
                                            name="email"
                                            placeholder="email@example.com"
                                            className={
                                                errors.email
                                                    ? "form-control form-control-lg bg-light border-0 is-invalid fs-6"
                                                    : "form-control form-control-lg bg-light border-0 fs-6"
                                            }
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback ps-1">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-secondary text-uppercase mb-2">Role</label>
                                        <select
                                            name="role"
                                            className={
                                                errors.role
                                                    ? "form-select form-select-lg bg-light border-0 is-invalid fs-6"
                                                    : "form-select form-select-lg bg-light border-0 fs-6"
                                            }
                                            value={formData.role}
                                            onChange={handleChange}
                                        >
                                            <option value="Select">Select Role</option>
                                            <option value="manager">Manager</option>
                                            <option value="viewer">Viewer</option>
                                        </select>
                                        {errors.role && (
                                            <div className="invalid-feedback ps-1">
                                                {errors.role}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <button className="btn btn-primary btn-lg w-100 fw-bold rounded-pill shadow-sm" disabled={actionLoading}>
                                            {actionLoading ? (
                                                <div
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                >
                                                    <span className="visually-hidden">
                                                        Loading...
                                                    </span>
                                                </div>
                                            ) : (
                                                <>Add Member</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Can>

                {/* View users table */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h5 className="fw-bold mb-0">Team Members</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="px-4 py-3 border-0">Name</th>
                                            <th className="py-3 border-0">Email</th>
                                            <th className="py-3 border-0">Role</th>
                                            <th className="text-center py-3 border-0 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="text-center py-5 text-muted"
                                                >
                                                    <i className="bi bi-people display-4 d-block mb-2 opacity-25"></i>
                                                    No users found. Start by adding one!
                                                </td>
                                            </tr>
                                        )}
                                        {users.length > 0 &&
                                            users.map((user) => (
                                                <tr key={user._id}>
                                                    <td className="px-4 align-middle fw-medium">
                                                        {user.name}
                                                    </td>
                                                    <td className="align-middle text-muted small">
                                                        {user.email}
                                                    </td>
                                                    <td className="align-middle">
                                                        <span className={`badge rounded-pill px-3 py-2 ${user.role === 'manager' ? 'bg-primary-subtle text-primary' : 'bg-light text-dark border'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="align-middle text-center px-4">
                                                        <button className="btn btn-sm btn-link text-primary fw-bold text-decoration-none me-2">
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-link text-danger fw-bold text-decoration-none"
                                                            onClick={() => handleDelete(user._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;