import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverEndpoint } from "../config/appConfig";
import AddExpenseModal from "../components/AddExpenseModal";

function GroupExpenses() {
    const { groupId } = useParams();
    const userDetails = useSelector((state) => state.userDetails);
    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const groupRes = await axios.get(`${serverEndpoint}/groups/my-groups`, { withCredentials: true });
            const currentGroup = groupRes.data.groups?.find(g => g._id === groupId);
            setGroup(currentGroup);

            const expenseRes = await axios.get(`${serverEndpoint}/expenses/${groupId}`, { withCredentials: true });
            setExpenses(expenseRes.data);

            const summaryRes = await axios.get(`${serverEndpoint}/expenses/${groupId}/summary`, { withCredentials: true });
            setBalances(summaryRes.data.balances);
        } catch (error) {
            console.error("Error fetching group data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [groupId]);

    const handleRequestSettlement = async () => {
        if (!window.confirm("Notify Admin that you have paid?")) return;
        try {
            await axios.post(`${serverEndpoint}/expenses/request-settle`, { groupId }, { withCredentials: true });
            fetchData();
        } catch (error) {
            alert("Failed to request settlement");
        }
    };

    const handleConfirmSettlement = async () => {
        if (!window.confirm("Confirm money received and settle all dues?")) return;
        try {
            await axios.post(`${serverEndpoint}/expenses/confirm-settle`, { groupId }, { withCredentials: true });
            fetchData();
        } catch (error) {
            alert("Failed to confirm settlement");
        }
    };

    const handleReopen = async () => {
        if (!window.confirm("This will mark all past expenses as unsettled. Continue?")) return;
        try {
            await axios.post(`${serverEndpoint}/expenses/reopen`, { groupId }, { withCredentials: true });
            fetchData();
        } catch (error) {
            alert("Failed to re-open group");
        }
    };

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (!group) return <div className="p-5 text-center">Group not found or Access Denied</div>;

    // Helper to check if current user is the Group Admin (Creator)
    const isGroupAdmin = userDetails?._id?.toString() === group.adminId?.toString();

    return (
        <div className="container py-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Groups</Link></li>
                    <li className="breadcrumb-item active">{group.name}</li>
                </ol>
            </nav>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">{group.name}</h2>
                    <span className={`badge rounded-pill ${group.paymentStatus?.isPaid ? 'bg-success' : group.paymentStatus?.isPendingApproval ? 'bg-info text-dark' : 'bg-warning text-dark'}`}>
                        {group.paymentStatus?.isPaid ? 'Settled' : group.paymentStatus?.isPendingApproval ? 'Pending Approval' : 'Active'}
                    </span>
                </div>

                <div className="d-flex gap-2">
                    {/* 1. Request Settle: Shown to everyone if group is active */}
                    {!group.paymentStatus?.isPaid && !group.paymentStatus?.isPendingApproval && (
                        <button className="btn btn-success rounded-pill px-4 shadow-sm" onClick={handleRequestSettlement}>
                            <i className="bi bi-cash me-2"></i>Settle Up
                        </button>
                    )}

                    {/* 2. Admin Action: Only the group creator sees "Confirm Settlement" */}
                    {group.paymentStatus?.isPendingApproval && isGroupAdmin && (
                        <button className="btn btn-warning rounded-pill px-4 shadow-sm" onClick={handleConfirmSettlement}>
                            <i className="bi bi-check-all me-2"></i>Confirm Settlement
                        </button>
                    )}

                    {/* 3. Member View: Other members see "Awaiting Admin Approval" */}
                    {group.paymentStatus?.isPendingApproval && !isGroupAdmin && (
                        <span className="badge bg-light text-dark border rounded-pill px-3 d-flex align-items-center">
                            Awaiting Admin Approval
                        </span>
                    )}

                    {/* 4. Re-open Group: Only for Admin when already settled */}
                    {group.paymentStatus?.isPaid && isGroupAdmin && (
                        <button className="btn btn-outline-danger rounded-pill px-4 shadow-sm" onClick={handleReopen}>
                            <i className="bi bi-arrow-counterclockwise me-2"></i>Re-open Group
                        </button>
                    )}

                    <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => setShowAddModal(true)}>
                        <i className="bi bi-plus-lg me-2"></i>Add Expense
                    </button>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-4">
                    {/* Net Balances Card */}
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Net Balances</h5>
                            {Object.keys(balances).length === 0 ? (
                                <p className="text-muted small">No expenses yet.</p>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {Object.entries(balances).map(([email, data]) => {
                                        const isMe = email === userDetails?.email;
                                        const displayName = isMe ? "You" : (data.name || email.split('@')[0]);
                                        const amount = data.amount || 0;

                                        return (
                                            <li key={email} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="rounded-circle bg-light border d-flex align-items-center justify-content-center fw-bold text-secondary" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                        {displayName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="small text-truncate" style={{ maxWidth: '120px' }} title={email}>
                                                        {displayName}
                                                    </div>
                                                </div>
                                                <span className={`fw-bold small ${amount >= 0 ? 'text-success' : 'text-danger'}`}>
                                                    {amount >= 0
                                                        ? `${isMe ? 'get' : 'gets'} ₹${amount.toFixed(2)}`
                                                        : `${isMe ? 'owe' : 'owes'} ₹${Math.abs(amount).toFixed(2)}`}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Settlement History Card */}
                    <div className="card border-0 shadow-sm rounded-4 mt-4">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-3 small text-uppercase text-muted ls-1">Settlement History</h5>
                            <div className="timeline-small">
                                {expenses.filter(e => e.isSettled).length === 0 ? (
                                    <p className="text-muted extra-small mb-0">No past settlements recorded.</p>
                                ) : (
                                    <div className="vstack gap-2">
                                        {[...new Set(expenses.filter(e => e.isSettled).map(e => new Date(e.settledAt || e.date).toLocaleDateString()))].map(date => (
                                            <div key={date} className="p-2 border rounded-3 bg-light">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="extra-small fw-bold text-dark">{date}</span>
                                                    <span className="badge bg-success-subtle text-success extra-small">Verified</span>
                                                </div>
                                                <p className="extra-small text-muted mb-0 mt-1">
                                                    Dues cleared for all members.
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    {/* Recent Activity Card */}
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Recent Activity</h5>
                            {expenses.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-receipt display-4 mb-3 d-block opacity-50"></i>
                                    No expenses added yet.
                                </div>
                            ) : (
                                <div className="vstack gap-3">
                                    {expenses.map(expense => (
                                        <div key={expense._id} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 border-start border-4 border-primary">
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold text-dark">{expense.description}</span>
                                                <span className="text-muted extra-small">
                                                    Paid by <span className="fw-medium">
                                                        {expense.payerEmail === userDetails?.email ? 'You' : expense.payerName}
                                                    </span>
                                                    {' • '}{new Date(expense.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="text-end">
                                                <h5 className="mb-0 fw-bold">₹{expense.amount}</h5>
                                                {expense.isSettled && (
                                                    <span className="badge bg-secondary extra-small">
                                                        Settled by {expense.settledBy === userDetails?.email ? 'You' : expense.settledBy?.split('@')[0]}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AddExpenseModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                groupId={groupId}
                members={group.membersEmail || []}
                onSuccess={fetchData}
            />
        </div>
    );
}

export default GroupExpenses;