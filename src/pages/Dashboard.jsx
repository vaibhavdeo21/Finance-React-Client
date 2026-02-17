import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverEndpoint } from "../config/appConfig";
import CreateGroupModal from "../components/CreateGroupModal";
import GroupCard from "../components/GroupCard";
import StatsCard from "../components/StatsCard";

function Dashboard() {
    const userDetails = useSelector((state) => state.userDetails);
    const [groups, setGroups] = useState([]);
    // UPDATED: Added credits to initial state to prevent 'undefined' on first load
    const [stats, setStats] = useState({ 
        totalSpent: 0, 
        totalPaid: 0, 
        totalOwed: 0, 
        credits: 0, 
        recentActivity: [] 
    });
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isActivityCleared, setIsActivityCleared] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Groups
            const groupRes = await axios.get(`${serverEndpoint}/groups/my-groups`, { withCredentials: true });
            setGroups(groupRes.data.groups || []);

            // 2. Fetch Stats & Credits
            try {
                const statsRes = await axios.get(`${serverEndpoint}/expenses/dashboard-stats`, { withCredentials: true });
                // Ensure statsRes.data contains the 'credits' field from your backend controller
                setStats(statsRes.data);
            } catch (err) {
                console.warn("Stats endpoint not ready yet, showing defaults.");
            }
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper for activity categories
    const getCategoryBadge = (description) => {
        const desc = description.toLowerCase();
        if (desc.includes('food') || desc.includes('dinner') || desc.includes('lunch')) {
            return <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle ms-2">Food</span>;
        } else if (desc.includes('travel') || desc.includes('taxi') || desc.includes('fuel')) {
            return <span className="badge rounded-pill bg-info-subtle text-info-emphasis border border-info-subtle ms-2">Travel</span>;
        } else if (desc.includes('shop') || desc.includes('buy')) {
            return <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis border border-primary-subtle ms-2">Shopping</span>;
        } else {
            return <span className="badge rounded-pill bg-light text-dark border ms-2">Other</span>;
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
        <div className="container py-5">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="fw-bold mb-1">Welcome back, {userDetails?.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-muted">Here is your financial overview.</p>
                </div>
                <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => setShowCreateModal(true)}>
                    <i className="bi bi-plus-lg me-2"></i>New Group
                </button>
            </div>

            {/* Stats Row */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <StatsCard
                        title="Others Owe You"
                        value={`₹${(stats.totalPaid || 0).toLocaleString()}`}
                        icon="bi-arrow-down-left-circle"
                        color="success"
                    />
                </div>
                <div className="col-md-4">
                    <StatsCard
                        title="You Owe Others"
                        value={`₹${(stats.totalOwed || 0).toLocaleString()}`}
                        icon="bi-arrow-up-right-circle"
                        color="danger"
                    />
                </div>
                {/* FIX: Points to stats.credits (fresh API data) instead of userDetails.credits (stale Redux) */}
                <div className="col-md-4">
                    <StatsCard
                        title="Available Credits"
                        value={stats.credits ?? 0}
                        icon="bi-coin"
                        color="warning"
                    />
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold m-0">Your Groups</h4>
                        <Link to="/groups" className="text-decoration-none small fw-bold">View All</Link>
                    </div>

                    {groups.length === 0 ? (
                        <div className="text-center p-5 bg-light rounded-4 border border-dashed">
                            <p className="text-muted mb-0">No groups yet. Create one to get started!</p>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {groups.slice(0, 4).map(group => (
                                <div key={group._id} className="col-md-6">
                                    <GroupCard group={group} onUpdate={fetchData} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-lg-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold m-0">Recent Activity</h4>
                        {!isActivityCleared && stats.recentActivity.length > 0 && (
                            <button className="btn btn-sm btn-link text-muted text-decoration-none fw-bold small p-0" onClick={() => setIsActivityCleared(true)}>Clear</button>
                        )}
                        {isActivityCleared && (
                            <button className="btn btn-sm btn-link text-primary text-decoration-none fw-bold small p-0" onClick={() => setIsActivityCleared(false)}>Restore</button>
                        )}
                    </div>

                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-0">
                            {stats.recentActivity.length === 0 || isActivityCleared ? (
                                <p className="text-muted p-4 text-center mb-0 small">
                                    {isActivityCleared ? "Activity hidden for this session." : "No recent transactions."}
                                </p>
                            ) : (
                                <ul className="list-group list-group-flush rounded-4">
                                    {stats.recentActivity.map(activity => (
                                        <li key={activity._id} className="list-group-item p-3 border-bottom-0 border-light d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle bg-light p-2 text-primary">
                                                    <i className="bi bi-receipt"></i>
                                                </div>
                                                <div>
                                                    <div className="d-flex align-items-center">
                                                        <p className="mb-0 fw-bold small text-truncate" style={{ maxWidth: '100px' }}>{activity.description}</p>
                                                        {getCategoryBadge(activity.description)}
                                                    </div>
                                                    <p className="text-muted extra-small mb-0">{activity.groupId?.name || 'Group'}</p>
                                                </div>
                                            </div>
                                            <span className="fw-bold text-dark">₹{activity.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <CreateGroupModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSuccess={fetchData}
            />
        </div>
    );
}

export default Dashboard;