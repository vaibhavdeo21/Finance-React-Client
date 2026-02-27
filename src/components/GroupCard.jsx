import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";
import { useSelector } from "react-redux";

function GroupCard({ group, onUpdate }) {
    const userDetails = useSelector((state) => state.userDetails);
    const [showMembers, setShowMembers] = useState(false);
    const [memberEmail, setMemberEmail] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [errors, setErrors] = useState({});

    const handleShowMember = () => setShowMembers(!showMembers);

    const isGroupAdmin = userDetails?._id?.toString() === (group.adminId?._id || group.adminId)?.toString();

    const handleAddMember = async () => {
        if (memberEmail.length === 0) return;
        setErrors({});
        setIsAdding(true);

        try {
            const response = await axios.patch(
                `${serverEndpoint}/groups/members/add`,
                {
                    groupId: group._id,
                    emails: [memberEmail],
                },
                { withCredentials: true }
            );
            setMemberEmail("");
            onUpdate(); // Trigger refresh
        } catch (error) {
            console.error(error);
            setErrors({ message: error.response?.data?.message || "Unable to add member" });
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemoveMember = async (emailToRemove) => {
        if (!window.confirm(`Remove ${emailToRemove} from the group?`)) return;

        try {
            await axios.patch(
                `${serverEndpoint}/groups/members/remove`,
                {
                    groupId: group._id,
                    emails: [emailToRemove],
                },
                { withCredentials: true }
            );
            onUpdate();
        } catch (error) {
            console.error(error);
            alert("Failed to remove member");
        }
    };

    return (
        <div className="card h-100 border-0 shadow-sm rounded-4 transition-hover">
            <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary mb-2">
                        <i className="bi bi-collection-fill fs-4"></i>
                    </div>
                    {group.adminEmail && (
                        <span className="badge rounded-pill bg-light text-dark border fw-normal small">
                            Admin: {group.adminEmail.split("@")[0]}
                        </span>
                    )}
                </div>

                <h5 className="fw-bold mb-1 text-dark text-truncate">
                    {group.name}
                </h5>

                <button
                    className="btn btn-sm text-primary p-0 text-start fw-medium mb-3 shadow-none"
                    onClick={handleShowMember}
                >
                    <i className={`bi bi-people-fill me-1`}></i>
                    {group.membersEmail.length} Members{" "}
                    {showMembers ? "▴" : "▾"}
                </button>

                <p className="text-muted small mb-3 flex-grow-1">
                    {group.description || "No description provided."}
                </p>

                <Link
                    to={`/groups/${group._id}`}
                    className="btn btn-outline-primary btn-sm rounded-pill fw-bold mb-4 w-100 py-2"
                >
                    View & Add Expenses
                </Link>

                {showMembers && (
                    <div className="bg-light rounded-3 p-3 mb-4 border-0 shadow-inner">
                        <h6 className="extra-small fw-bold text-uppercase text-secondary mb-3">
                            Member List
                        </h6>
                        <div
                            className="overflow-auto"
                            style={{ maxHeight: "150px" }}
                        >
                            {group.membersEmail.map((member, index) => (
                                <div
                                    key={index}
                                    className="d-flex align-items-center justify-content-between mb-2 last-child-mb-0"
                                >
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="rounded-circle bg-white border d-flex align-items-center justify-content-center me-2 fw-bold text-primary shadow-sm"
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                fontSize: "10px",
                                            }}
                                        >
                                            {member.charAt(0).toUpperCase()}
                                        </div>
                                        <span
                                            className="small text-dark text-truncate"
                                            style={{ maxWidth: "150px" }}
                                            title={member}
                                        >
                                            {member === userDetails?.email ? "You" : member}
                                        </span>
                                    </div>
                                    
                                    {/* Only Admin can see the Remove button, and cannot remove themselves */}
                                    {isGroupAdmin && member !== group.adminEmail && (
                                        <button 
                                            className="btn btn-link text-danger p-0 border-0" 
                                            onClick={() => handleRemoveMember(member)}
                                            style={{ fontSize: '14px' }}
                                        >
                                            <i className="bi bi-x-circle-fill"></i>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {errors.message && (
                    <div className="alert alert-danger py-1 px-2 small border-0 mb-3">
                        {errors.message}
                    </div>
                )}

                <div className="mt-auto pt-3 border-top">
                    <label className="form-label extra-small fw-bold text-uppercase text-muted mb-2">
                        Invite a Friend
                    </label>
                    <div className="input-group input-group-sm">
                        <input
                            type="email"
                            className="form-control bg-light border-0 px-3"
                            placeholder="email@example.com"
                            value={memberEmail}
                            disabled={isAdding}
                            onChange={(e) => setMemberEmail(e.target.value)}
                        />
                        <button
                            className="btn btn-primary px-3 fw-bold d-flex align-items-center"
                            onClick={handleAddMember}
                            disabled={isAdding || memberEmail.length === 0}
                        >
                            {isAdding ? (
                                <span className="spinner-border spinner-border-sm me-1"></span>
                            ) : "Add"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupCard;