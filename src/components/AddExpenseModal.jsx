import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; 
import { serverEndpoint } from "../config/appConfig";

function AddExpenseModal({ show, onHide, groupId, members, onSuccess }) {
    // Get logged in user details from Redux
    const userDetails = useSelector((state) => state.userDetails);
    
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [payer, setPayer] = useState("");
    const [splitType, setSplitType] = useState("EQUAL"); 
    const [splitDetails, setSplitDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (members && members.length > 0) {
            // FIX: Default to logged-in user if they are in the group, otherwise first member
            // Handles both string arrays and object arrays for backwards compatibility
            const memberEmails = members.map(m => typeof m === 'string' ? m : m.email);
            const defaultPayer = memberEmails.find(email => email === userDetails?.email) || memberEmails[0];
            
            setPayer(defaultPayer); 
            resetSplits(members);
        }
    }, [members, userDetails, show]); 

    const resetSplits = (currentMembers) => {
        const initialSplits = currentMembers.map(member => {
            const email = typeof member === 'string' ? member : member.email;
            const role = typeof member === 'string' ? 'viewer' : (member.role || 'viewer');
            return {
                email,
                role,
                amount: 0,
                included: true
            };
        });
        setSplitDetails(initialSplits);
    };

    useEffect(() => {
        if (splitType === "EQUAL" && amount) {
            const activeMembers = splitDetails.filter(s => s.included);
            const count = activeMembers.length;
            if (count === 0) return;

            const share = parseFloat((parseFloat(amount) / count).toFixed(2));
            
            setSplitDetails(prev => prev.map(s => ({
                ...s,
                amount: s.included ? share : 0
            })));
        }
    }, [amount, splitType, splitDetails.map(s => s.included).join()]);

    const handleSplitChange = (email, field, value) => {
        setSplitDetails(prev => prev.map(s => {
            if (s.email === email) {
                return { ...s, [field]: value };
            }
            return s;
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const finalSplits = splitDetails
                .filter(s => s.included)
                .map(s => ({
                    email: s.email,
                    amount: parseFloat(s.amount)
                }));

            const totalSplit = finalSplits.reduce((sum, s) => sum + s.amount, 0);
            if (Math.abs(totalSplit - parseFloat(amount)) > 0.5) {
                throw new Error(`Split total (₹${totalSplit}) does not match Expense Amount (₹${amount})`);
            }

            await axios.post(
                `${serverEndpoint}/expenses/add`,
                {
                    groupId,
                    description,
                    amount: parseFloat(amount),
                    payerEmail: payer,
                    splits: finalSplits
                },
                { withCredentials: true }
            );

            onSuccess();
            onHide();
            setDescription("");
            setAmount("");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to add expense");
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 rounded-4 shadow">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Add New Expense</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body p-4">
                        {error && <div className="alert alert-danger py-2 small">{error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">Description</label>
                                    <input type="text" className="form-control bg-light border-0" required
                                        value={description} onChange={e => setDescription(e.target.value)} 
                                        placeholder="e.g. Dinner, Taxi, Groceries" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">Amount (₹)</label>
                                    <input type="number" className="form-control bg-light border-0" required min="1"
                                        value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">Who Paid?</label>
                                <select className="form-select bg-light border-0" value={payer} onChange={e => setPayer(e.target.value)}>
                                    {members.map(m => {
                                        const email = typeof m === 'string' ? m : m.email;
                                        const role = typeof m === 'string' ? '' : `(${m.role})`;
                                        return (
                                            <option key={email} value={email}>
                                                {email === userDetails?.email ? `You ${role}` : `${email.split('@')[0]} ${role}`}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <label className="form-label small fw-bold text-muted mb-0">Split Method</label>
                                <div className="d-flex gap-2">
                                    <button type="button" 
                                        className={`btn btn-sm rounded-pill px-3 ${splitType === 'EQUAL' ? 'btn-primary' : 'btn-light border'}`}
                                        onClick={() => setSplitType("EQUAL")}>
                                        Equally
                                    </button>
                                    <button type="button" 
                                        className={`btn btn-sm rounded-pill px-3 ${splitType === 'UNEQUAL' ? 'btn-primary' : 'btn-light border'}`}
                                        onClick={() => setSplitType("UNEQUAL")}>
                                        Unequally
                                    </button>
                                </div>
                            </div>

                            <div className="bg-light p-3 rounded-4 mb-4">
                                <h6 className="small fw-bold text-muted mb-3">Split Details</h6>
                                <div className="overflow-auto" style={{maxHeight: '200px'}}>
                                    {splitDetails.map((split) => (
                                        <div key={split.email} className="d-flex align-items-center mb-3 gap-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox"
                                                    checked={split.included}
                                                    onChange={e => handleSplitChange(split.email, "included", e.target.checked)}
                                                />
                                            </div>
                                            <div className="flex-grow-1 text-truncate small fw-medium">
                                                {split.email === userDetails?.email ? "You" : split.email.split('@')[0]}
                                                {split.role !== 'viewer' && (
                                                    <span className="badge bg-secondary-subtle text-secondary extra-small ms-2 px-2 py-1 rounded-pill" style={{fontSize: '9px'}}>
                                                        {split.role.toUpperCase()}
                                                    </span>
                                                )}
                                                <div className="extra-small text-muted">{split.email}</div>
                                            </div>
                                            <div className="input-group input-group-sm" style={{ width: "130px" }}>
                                                <span className="input-group-text border-0 bg-white">₹</span>
                                                <input type="number" className="form-control border-0 text-end"
                                                    value={split.amount}
                                                    disabled={splitType === "EQUAL" || !split.included}
                                                    onChange={e => handleSplitChange(split.email, "amount", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-light rounded-pill px-4" onClick={onHide}>Cancel</button>
                                <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={loading}>
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : null}
                                    Save Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddExpenseModal;