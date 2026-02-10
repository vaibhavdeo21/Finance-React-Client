import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; // Added
import { serverEndpoint } from "../config/appConfig";
import AddExpenseModal from "../components/AddExpenseModal";

function GroupExpenses() {
    const { groupId } = useParams();
    const userDetails = useSelector((state) => state.userDetails); // Get current user
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

    const handleSettleUp = async () => {
        if (!window.confirm("Are you sure you want to settle all debts? This cannot be undone.")) return;
        try {
            await axios.post(`${serverEndpoint}/expenses/settle`, { groupId }, { withCredentials: true });
            fetchData();
        } catch (error) {
            alert("Failed to settle group");
        }
    };

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (!group) return <div className="p-5 text-center">Group not found or Access Denied</div>;

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
                    <span className={`badge rounded-pill ${group.paymentStatus?.isPaid ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {group.paymentStatus?.isPaid ? 'Settled' : 'Active'}
                    </span>
                </div>
                <div className="d-flex gap-2">
                    {!group.paymentStatus?.isPaid && (
                        <button className="btn btn-success rounded-pill px-4" onClick={handleSettleUp}>
                            <i className="bi bi-check-circle me-2"></i>Settle Up
                        </button>
                    )}
                    <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => setShowAddModal(true)}>
                        <i className="bi bi-plus-lg me-2"></i>Add Expense
                    </button>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Net Balances</h5>
                            {Object.keys(balances).length === 0 ? (
                                <p className="text-muted small">No expenses yet.</p>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {Object.entries(balances).map(([email, amount]) => {
                                        // Check if the email in the list is the same as the logged-in user
                                        const isMe = email === userDetails?.email;

                                        // If it's the user, show "You". Otherwise, show the name (or email prefix as fallback)
                                        const displayName = isMe ? "You" : email.split('@')[0];

                                        return (
                                            <li key={email} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="rounded-circle bg-light border d-flex align-items-center justify-content-center fw-bold text-secondary" style={{ width: '32px', height: '32px' }}>
                                                        {displayName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="small text-truncate">
                                                        {displayName}
                                                    </div>
                                                </div>
                                                {/* Logic for "You owe" vs "You get" */}
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
                                        <div key={expense._id} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 border-start border-4 border-primary">
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold text-dark">{expense.description}</span>
                                                <span className="text-muted extra-small">
                                                    Paid by <span className="fw-medium">{expense.payerEmail === userDetails?.email ? 'You' : expense.payerEmail.split('@')[0]}</span>
                                                    {' • '}{new Date(expense.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="text-end">
                                                <h5 className="mb-0 fw-bold">₹{expense.amount}</h5>
                                                {expense.isSettled && <span className="badge bg-secondary extra-small">Settled</span>}
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