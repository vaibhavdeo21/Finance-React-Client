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

    // NEW: Budget State
    const [budgetGoal, setBudgetGoal] = useState(0);

    const fetchData = async () => {
        try {
            setLoading(true);
            const groupRes = await axios.get(`${serverEndpoint}/groups/my-groups`, { withCredentials: true });
            const currentGroup = groupRes.data.groups?.find(g => g._id === groupId);
            setGroup(currentGroup);

            // Initialize budget from group data if it exists
            setBudgetGoal(currentGroup.budgetGoal || 0);

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

    // NEW: Function to update Budget Goal
    const handleUpdateBudget = async () => {
        const newBudget = prompt("Set a Budget Goal for this group (₹):", budgetGoal);
        if (newBudget === null || newBudget.trim() === "" || isNaN(newBudget)) return;

        try {
            // Update on server
            await axios.patch(`${serverEndpoint}/groups/${groupId}/budget`, { budgetGoal: Number(newBudget) }, { withCredentials: true });
            setBudgetGoal(Number(newBudget));
            fetchData();
        } catch (error) {
            alert("Failed to update budget goal");
        }
    };

    // NEW: Function to reset Budget Goal to zero (No Limit)
    const handleResetBudget = async () => {
        if (!window.confirm("Remove budget limit for this group?")) return;

        try {
            await axios.patch(`${serverEndpoint}/groups/${groupId}/budget`, { budgetGoal: 0 }, { withCredentials: true });
            setBudgetGoal(0);
            fetchData();
            alert("Budget limit removed!");
        } catch (error) {
            console.error("Budget reset error", error);
            alert("Failed to reset budget.");
        }
    };

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

    const handleDeleteGroup = async () => {
        const confirmMessage = "⚠️ DANGER ZONE ⚠️\n\nAre you sure you want to delete this group?\nThis will permanently delete the group and ALL expense history associated with it.\n\nThis action cannot be undone.";

        if (!window.confirm(confirmMessage)) return;

        try {
            await axios.delete(`${serverEndpoint}/groups/${groupId}`, { withCredentials: true });
            alert("Group deleted successfully.");
            window.location.href = "/dashboard";
        } catch (error) {
            console.error("Delete error", error);
            alert(error.response?.data?.message || "Failed to delete group");
        }
    };

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (!group) return <div className="p-5 text-center">Group not found or Access Denied</div>;

    const groupAdminId = group.adminId?._id || group.adminId;
    const isGroupAdmin = userDetails?._id?.toString() === groupAdminId?.toString();

    // NEW: Calculations for Header & Budgeting
    const totalGroupSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const isOverBudget = budgetGoal > 0 && totalGroupSpending > budgetGoal;
    const progressPercent = budgetGoal > 0 ? Math.min((totalGroupSpending / budgetGoal) * 100, 100) : 0;

    return (
        <div className="container py-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/dashboard">Groups</Link></li>
                    <li className="breadcrumb-item active">{group.name}</li>
                </ol>
            </nav>

            <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="flex-grow-1">
                    <h2 className="fw-bold mb-0">{group.name}</h2>
                    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                        <span className={`badge rounded-pill ${group.paymentStatus?.isPaid ? 'bg-success' : group.paymentStatus?.isPendingApproval ? 'bg-info text-dark' : 'bg-warning text-dark'}`}>
                            {group.paymentStatus?.isPaid ? 'Settled' : group.paymentStatus?.isPendingApproval ? 'Pending Approval' : 'Active'}
                        </span>

                        {/* UPDATED: Budget Badge with Solid Visual Buttons */}
                        <div className={`badge rounded-pill px-3 py-2 border d-flex align-items-center shadow-sm ${isOverBudget ? 'bg-danger text-white border-danger' : 'bg-white text-dark border-light-subtle'}`}>
                            <i className={`bi bi-graph-up-arrow me-2 ${isOverBudget ? 'text-white' : 'text-primary'}`}></i>
                            <span className="me-2 fw-bold">
                                Spent: ₹{totalGroupSpending.toLocaleString()} / {budgetGoal > 0 ? `₹${budgetGoal.toLocaleString()}` : "No Limit"}
                            </span>
                            
                            {isGroupAdmin && (
                                <div className="d-flex gap-1">
                                    {/* Solid Edit Button with Text for Accessibility */}
                                    <button 
                                        className={`btn btn-sm rounded-pill px-2 d-flex align-items-center justify-content-center border-0 shadow-sm ${isOverBudget ? 'btn-light text-danger' : 'btn-primary text-white'}`}
                                        style={{ height: '22px', fontSize: '10px' }}
                                        onClick={handleUpdateBudget}
                                        type="button"
                                    >
                                        <i className="bi bi-pencil-fill me-1"></i> SET
                                    </button>

                                    {/* Solid Reset Button with Text for Accessibility */}
                                    {budgetGoal > 0 && (
                                        <button 
                                            className={`btn btn-sm rounded-pill px-2 d-flex align-items-center justify-content-center border-0 shadow-sm ${isOverBudget ? 'btn-light text-danger' : 'btn-secondary text-white'}`}
                                            style={{ height: '22px', fontSize: '10px' }}
                                            onClick={handleResetBudget}
                                            type="button"
                                        >
                                            <i className="bi bi-arrow-counterclockwise me-1"></i> RESET
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* NEW: Progress Bar Visualization */}
                    {budgetGoal > 0 && (
                        <div className="progress mt-3 rounded-pill shadow-sm" style={{ height: '8px', maxWidth: '350px' }}>
                            <div
                                className={`progress-bar progress-bar-striped progress-bar-animated ${isOverBudget ? 'bg-danger' : 'bg-success'}`}
                                role="progressbar"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    )}
                </div>

                <div className="d-flex gap-2 flex-shrink-0">
                    {!group.paymentStatus?.isPaid && !group.paymentStatus?.isPendingApproval && (
                        <button className="btn btn-success rounded-pill px-4 shadow-sm fw-bold" onClick={handleRequestSettlement}>
                            <i className="bi bi-cash me-2"></i>Settle Up
                        </button>
                    )}

                    {group.paymentStatus?.isPendingApproval && isGroupAdmin && (
                        <button className="btn btn-warning rounded-pill px-4 shadow-sm fw-bold" onClick={handleConfirmSettlement}>
                            <i className="bi bi-check-all me-2"></i>Confirm Settlement
                        </button>
                    )}

                    {group.paymentStatus?.isPendingApproval && !isGroupAdmin && (
                        <span className="badge bg-light text-dark border rounded-pill px-3 d-flex align-items-center fw-bold">
                            Awaiting Admin Approval
                        </span>
                    )}

                    {group.paymentStatus?.isPaid && isGroupAdmin && (
                        <button className="btn btn-outline-danger rounded-pill px-4 shadow-sm fw-bold" onClick={handleReopen}>
                            <i className="bi bi-arrow-counterclockwise me-2"></i>Re-open Group
                        </button>
                    )}

                    {isGroupAdmin && (
                        <button
                            className="btn btn-danger rounded-pill px-3 shadow-sm d-flex align-items-center fw-bold"
                            onClick={handleDeleteGroup}
                        >
                            <i className="bi bi-trash me-2"></i>
                            <span className="small">Delete Group</span>
                        </button>
                    )}

                    <button className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold" onClick={() => setShowAddModal(true)}>
                        <i className="bi bi-plus-lg me-2"></i>Add Expense
                    </button>
                </div>
            </div>

            {/* NEW: Over Budget Alert */}
            {isOverBudget && (
                <div className="alert alert-danger rounded-4 shadow-sm border-0 d-flex align-items-center mb-4 animate__animated animate__headShake">
                    <i className="bi bi-exclamation-octagon-fill fs-4 me-3"></i>
                    <div>
                        <h6 className="fw-bold mb-0">Budget Limit Exceeded!</h6>
                        <p className="small mb-0">This group has crossed its budget of ₹{budgetGoal.toLocaleString()} by ₹{(totalGroupSpending - budgetGoal).toLocaleString()}.</p>
                    </div>
                </div>
            )}

            <div className="row g-4">
                <div className="col-lg-4">
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
                                                    <div className="small text-truncate fw-medium" style={{ maxWidth: '120px' }} title={email}>
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
                                        <div key={expense._id} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 mb-2 hover-shadow-sm transition">
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold text-dark">{expense.description}</span>
                                                <span className="text-muted extra-small">
                                                    Total: ₹{expense.amount} • Paid by {expense.payerEmail === userDetails?.email ? 'You' : expense.payerName}
                                                </span>
                                            </div>

                                            <div className="text-end">
                                                {expense.isSettled ? (
                                                    <div className="d-flex flex-column align-items-end">
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 mb-1">
                                                            <i className="bi bi-check-circle-fill me-1"></i>
                                                            {expense.settledBy === userDetails?.email ? 'You' : expense.settledBy?.split('@')[0]} paid ₹{expense.splits.find(s => s.email === expense.settledBy)?.amount || 0}
                                                        </span>
                                                        <span className="extra-small text-muted">Settled on {new Date(expense.settledAt).toLocaleDateString()}</span>
                                                    </div>
                                                ) : (
                                                    <h5 className="mb-0 fw-bold text-primary">₹{expense.amount}</h5>
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