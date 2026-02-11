import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Essential for resolving the groupId ReferenceError
import { serverEndpoint } from "../config/appConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import Can from "../components/Can";

function ManageUsers() {
    const { groupId } = useParams(); // Extracts the current ID from the URL path
    const userDetails = useSelector((state) => state.userDetails); 
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [users, setUsers] = useState([]); 
    const [groups, setGroups] = useState([]); 
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Select",
    });

    // Fetch details for a specific group to refresh member state
    const fetchGroupDetails = async (id) => {
        try {
            const targetId = id || selectedGroup?._id || groupId;
            if (!targetId) return;

            const response = await axios.get(`${serverEndpoint}/groups/my-groups`, {
                withCredentials: true,
            });
            
            const refreshedGroup = response.data.groups?.find(g => g._id === targetId);
            if (refreshedGroup) {
                setSelectedGroup(refreshedGroup);
                const membersList = refreshedGroup.members && refreshedGroup.members.length > 0
                    ? refreshedGroup.members
                    : (refreshedGroup.membersEmail || []).map(email => ({ 
                        email, 
                        role: email === refreshedGroup.adminEmail ? 'admin' : 'viewer' 
                    }));
                setUsers(membersList);
            }
        } catch (error) {
            console.error("Error refreshing group details:", error);
        }
    };

    const fetchAdminGroups = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${serverEndpoint}/groups/my-groups`, {
                withCredentials: true,
            });

            const adminOnlyGroups = (response.data.groups || []).filter(
                g => (g.adminId?._id || g.adminId) === userDetails?._id
            );

            setGroups(adminOnlyGroups);
            
            // If we have a groupId in the URL, auto-select that group
            if (groupId) {
                const autoSelected = adminOnlyGroups.find(g => g._id === groupId);
                if (autoSelected) handleGroupSelect(autoSelected);
            }
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to fetch groups" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userDetails?._id) {
            fetchAdminGroups();
        }
    }, [userDetails, groupId]);

    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
        const membersList = group.members && group.members.length > 0
            ? group.members
            : (group.membersEmail || []).map(email => ({ 
                email, 
                role: email === group.adminEmail ? 'admin' : 'viewer' 
            }));

        setUsers(membersList);
    };

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

        if (!formData.email) {
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
        if (!selectedGroup) {
            setErrors({ message: "Please select a group first" });
            return;
        }

        if (validate()) {
            setActionLoading(true);
            try {
                await axios.post(
                    `${serverEndpoint}/groups/${selectedGroup._id}/add-member`,
                    { email: formData.email.toLowerCase(), role: formData.role },
                    { withCredentials: true }
                );

                setMessage("Member added to group!");
                setFormData({ name: "", email: "", role: "Select" });
                fetchGroupDetails(selectedGroup._id); // Refresh list from DB
                setTimeout(() => setMessage(null), 3000);
            } catch (error) {
                const errorMsg = error.response?.data?.message || "Unable to add member";
                setErrors({ message: errorMsg });
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleUpdateRole = async (email, newRole) => {
        try {
            const targetGroupId = selectedGroup?._id || groupId;
            if (!targetGroupId) throw new Error("Group ID not found");

            await axios.patch(
                `${serverEndpoint}/groups/${targetGroupId}/member-role`,
                { email, role: newRole },
                { withCredentials: true }
            );

            fetchGroupDetails(targetGroupId); // Refresh UI with updated role
            alert(`User role updated to ${newRole}`);
        } catch (error) {
            console.error("Role update failed:", error);
            alert(error.response?.data?.message || "Failed to update role");
        }
    };

    const handleDelete = async (userEmail) => {
        if (!window.confirm(`Remove ${userEmail} from ${selectedGroup.name}?`)) return;

        try {
            await axios.post(`${serverEndpoint}/groups/${selectedGroup._id}/remove-member`,
                { email: userEmail },
                { withCredentials: true }
            );
            setUsers(users.filter(u => (u.email || u) !== userEmail));
            setMessage("Member removed from group");
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setErrors({ message: "Failed to remove member" });
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
                        Group <span className="text-primary">Permissions</span>
                    </h2>
                    <p className="text-muted mb-0">
                        Select a group you created to manage member roles and access.
                    </p>
                </div>
            </div>

            <div className="row g-4">
                {/* SIDEBAR: Group Selection */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h5 className="fw-bold mb-0">Admin Groups</h5>
                        </div>
                        <div className="card-body p-3">
                            <div className="list-group list-group-flush">
                                {groups.length === 0 ? (
                                    <p className="text-muted small p-2">You haven't created any groups yet.</p>
                                ) : (
                                    groups.map(g => (
                                        <button
                                            key={g._id}
                                            onClick={() => handleGroupSelect(g)}
                                            className={`list-group-item list-group-item-action border-0 rounded-3 mb-2 py-3 fw-bold d-flex align-items-center ${selectedGroup?._id === g._id ? 'bg-primary text-white shadow' : 'bg-light text-dark'}`}
                                        >
                                            <i className={`bi bi-people-fill me-3 ${selectedGroup?._id === g._id ? 'text-white' : 'text-primary'}`}></i>
                                            {g.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {selectedGroup && (
                        <div className="card shadow-sm border-0 rounded-4 mt-4">
                            <div className="card-header bg-white border-0 pt-4 px-4">
                                <h5 className="fw-bold mb-0 small text-uppercase">Add to {selectedGroup.name}</h5>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            name="email"
                                            placeholder="Enter email address"
                                            className="form-control bg-light border-0"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <select name="role" className="form-select bg-light border-0" value={formData.role} onChange={handleChange}>
                                            <option value="Select">Assign Role</option>
                                            <option value="admin">Admin</option>
                                            <option value="manager">Manager</option>
                                            <option value="viewer">Viewer</option>
                                        </select>
                                    </div>
                                    <button className="btn btn-primary w-100 fw-bold rounded-pill" disabled={actionLoading}>
                                        {actionLoading ? "Adding..." : "Add Member"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* MAIN AREA: Members Table */}
                <div className="col-md-8">
                    {!selectedGroup ? (
                        <div className="text-center py-5 bg-light rounded-4 border border-dashed h-100 d-flex flex-column align-items-center justify-content-center">
                            <i className="bi bi-arrow-left-circle display-1 text-muted mb-3 opacity-25"></i>
                            <h5 className="text-muted fw-bold">Select a group to manage</h5>
                            <p className="small text-muted">You can only manage members of groups you created.</p>
                        </div>
                    ) : (
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                            <div className="card-header bg-white border-0 pt-4 px-4">
                                <h5 className="fw-bold mb-0">Group Members</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="px-4 py-3 border-0">Email</th>
                                                <th className="py-3 border-0">Role</th>
                                                <th className="text-center py-3 border-0 px-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="text-center py-5 text-muted small">No members found in this group.</td>
                                                </tr>
                                            ) : (
                                                users.map((member) => {
                                                    const email = typeof member === 'string' ? member : member.email;
                                                    const role = member.role || "viewer";
                                                    const isThisMemberTheAdmin = email === selectedGroup.adminEmail;

                                                    return (
                                                        <tr key={email}>
                                                            <td className="px-4 align-middle fw-medium">
                                                                {email} {isThisMemberTheAdmin && <span className="badge bg-dark rounded-pill ms-2 fw-bold" style={{ fontSize: '10px' }}>OWNER</span>}
                                                            </td>
                                                            <td className="align-middle">
                                                                <select
                                                                    className="form-select form-select-sm bg-light border-0 fw-bold"
                                                                    style={{ width: '110px' }}
                                                                    value={role} 
                                                                    onChange={(e) => handleUpdateRole(email, e.target.value)}
                                                                >
                                                                    <option value="admin">Admin</option>
                                                                    <option value="manager">Manager</option>
                                                                    <option value="viewer">Viewer</option>
                                                                </select>
                                                            </td>
                                                            <td className="align-middle text-center px-4">
                                                                {!isThisMemberTheAdmin && (
                                                                    <button
                                                                        className="btn btn-sm btn-link text-danger fw-bold text-decoration-none"
                                                                        onClick={() => handleDelete(email)}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;