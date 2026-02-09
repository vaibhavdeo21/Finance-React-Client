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
                setErrors({});
            } catch (error) {
                console.log(error);
                setErrors({ message: "Unable to add user, please try again" });
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.post(
                    `${serverEndpoint}/users/delete`,
                    { userId },
                    { withCredentials: true }
                );
                setUsers(users.filter((user) => user._id !== userId));
            } catch (error) {
                console.log(error);
                alert("Failed to delete user");
            }
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
                <div className="alert alert-danger" role="alert">
                    {errors.message}
                </div>
            )}
            {message && (
                <div className="alert alert-success" role="alert">
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

            <div className="row">
                {/* Form to Add Users - Wrapped in Can to check permission */}
                <Can requiredPermission="canCreateUsers">
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white border-bottom-0 pt-3">
                                <h5 className="mb-0 fw-bold text-secondary">Add Member</h5>
                            </div>
                            <div className="card-body p-3">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className={errors.name ? "form-control is-invalid" : "form-control"}
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback ps-1">{errors.name}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Email</label>
                                        <input
                                            type="text"
                                            name="email"
                                            className={errors.email ? "form-control is-invalid" : "form-control"}
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback ps-1">{errors.email}</div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted">Role</label>
                                        <select
                                            name="role"
                                            className={errors.role ? "form-select is-invalid" : "form-select"}
                                            value={formData.role}
                                            onChange={handleChange}
                                        >
                                            <option value="Select">Select Role</option>
                                            <option value="manager">Manager</option>
                                            <option value="viewer">Viewer</option>
                                        </select>
                                        {errors.role && (
                                            <div className="invalid-feedback ps-1">{errors.role}</div>
                                        )}
                                    </div>

                                    <div className="mb-2">
                                        <button className="btn btn-primary w-100 rounded-pill fw-bold" disabled={actionLoading}>
                                            {actionLoading ? (
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ) : (
                                                "Add User"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Can>

                {/* Table to View Users */}
                <div className="col-md-9">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom-0 pt-3 pb-2">
                            <h5 className="mb-0 fw-bold text-secondary">Team Members</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-4 py-3 text-secondary small text-uppercase">Name</th>
                                            <th className="py-3 text-secondary small text-uppercase">Email</th>
                                            <th className="py-3 text-secondary small text-uppercase">Role</th>
                                            <th className="pe-4 py-3 text-secondary small text-uppercase text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center py-5 text-muted">
                                                    No users found. Start by adding one!
                                                </td>
                                            </tr>
                                        )}
                                        {users.length > 0 && users.map((user) => (
                                            <tr key={user._id}>
                                                <td className="ps-4 fw-medium text-dark">{user.name}</td>
                                                <td className="text-muted">{user.email}</td>
                                                <td>
                                                    <span className={`badge rounded-pill px-3 py-2 ${user.role === 'admin' ? 'bg-primary' : user.role === 'manager' ? 'bg-success' : 'bg-secondary'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="pe-4 text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Can requiredPermission="canUpdateUsers">
                                                            <button 
                                                                className="btn btn-sm btn-outline-primary border-0"
                                                                title="Edit"
                                                            >
                                                                <i className="bi bi-pencil-square"></i> Edit
                                                            </button>
                                                        </Can>
                                                        
                                                        <Can requiredPermission="canDeleteUsers">
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger border-0"
                                                                title="Delete"
                                                                onClick={() => handleDelete(user._id)}
                                                            >
                                                                <i className="bi bi-trash"></i> Delete
                                                            </button>
                                                        </Can>
                                                    </div>
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