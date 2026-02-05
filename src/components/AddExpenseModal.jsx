import { useState, useEffect } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function AddExpenseModal({ show, onHide, groupId, members, onSuccess }) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [payer, setPayer] = useState("");
    const [splitType, setSplitType] = useState("EQUAL"); // EQUAL or UNEQUAL
    
    // Manage split details for each member
    const [splitDetails, setSplitDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Initialize splits when members load
    useEffect(() => {
        if (members && members.length > 0) {
            setPayer(members[0]); // Default payer is first member
            resetSplits(members);
        }
    }, [members]);

    // Helper to reset splits based on current members
    const resetSplits = (currentMembers) => {
        const initialSplits = currentMembers.map(email => ({
            email,
            amount: 0,
            included: true
        }));
        setSplitDetails(initialSplits);
    };

    // Auto-calculate equal splits whenever Amount or Included Members change
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
            // Prepare payload
            const finalSplits = splitDetails
                .filter(s => s.included) // Only send included members
                .map(s => ({
                    email: s.email,
                    amount: parseFloat(s.amount)
                }));

            // Validation: Check total
            const totalSplit = finalSplits.reduce((sum, s) => sum + s.amount, 0);
            if (Math.abs(totalSplit - parseFloat(amount)) > 0.5) {
                throw new Error(`Split total (${totalSplit}) does not match Expense Amount (${amount})`);
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
            // Reset form
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
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 rounded-4 shadow">
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold">Add New Expense</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            {/* Top Row: Description & Amount */}
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">Description</label>
                                    <input type="text" className="form-control" required
                                        value={description} onChange={e => setDescription(e.target.value)} 
                                        placeholder="Dinner, Taxi, etc." />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">Amount (₹)</label>
                                    <input type="number" className="form-control" required min="1"
                                        value={amount} onChange={e => setAmount(e.target.value)} />
                                </div>
                            </div>

                            {/* Payer Selection */}
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">Paid By</label>
                                <select className="form-select" value={payer} onChange={e => setPayer(e.target.value)}>
                                    {members.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Split Type Toggle */}
                            <div className="d-flex gap-2 mb-3">
                                <button type="button" 
                                    className={`btn btn-sm rounded-pill px-3 ${splitType === 'EQUAL' ? 'btn-primary' : 'btn-light border'}`}
                                    onClick={() => setSplitType("EQUAL")}>
                                    Split Equally
                                </button>
                                <button type="button" 
                                    className={`btn btn-sm rounded-pill px-3 ${splitType === 'UNEQUAL' ? 'btn-primary' : 'btn-light border'}`}
                                    onClick={() => setSplitType("UNEQUAL")}>
                                    Split Unequally
                                </button>
                            </div>

                            {/* Member List for Splits */}
                            <div className="bg-light p-3 rounded-3 mb-3">
                                <h6 className="small fw-bold text-muted mb-3">Split Details</h6>
                                {splitDetails.map((split, idx) => (
                                    <div key={split.email} className="d-flex align-items-center mb-2 gap-2">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox"
                                                checked={split.included}
                                                onChange={e => handleSplitChange(split.email, "included", e.target.checked)}
                                            />
                                        </div>
                                        <div className="flex-grow-1 text-truncate small">{split.email}</div>
                                        <div className="input-group input-group-sm" style={{ width: "120px" }}>
                                            <span className="input-group-text border-0 bg-white">₹</span>
                                            <input type="number" className="form-control border-0"
                                                value={split.amount}
                                                disabled={splitType === "EQUAL" || !split.included}
                                                onChange={e => handleSplitChange(split.email, "amount", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-light rounded-pill" onClick={onHide}>Cancel</button>
                                <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={loading}>
                                    {loading ? "Adding..." : "Save Expense"}
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