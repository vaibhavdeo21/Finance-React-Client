import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function GroupCard({ group, onUpdate }) {
  const [showMembers, setShowMembers] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [errors, setErrors] = useState({}); 

  const handleShowMember = () => {
    setShowMembers(!showMembers);
  };

  // Logic to add a member to the group [cite: 2319, 2322]
  const handleAddMember = async () => {
    if (memberEmail.length === 0) {
        return;
    }
    try {
        const response = await axios.patch(
            `${serverEndpoint}/groups/members/add`,
            {
                groupId: group._id,
                emails: [memberEmail]
            },
            { withCredentials: true }
        );
        // Optimistic update: notify parent of the new group data [cite: 2322, 2333]
        onUpdate(response.data);
        setMemberEmail(''); 
        setErrors({});
    } catch (error) {
        console.error("Error adding member:", error);
        setErrors({ message: 'Unable to add member' });
    }
  };

  // Logic to remove a member from the group
  const handleRemoveMember = async (emailToRemove) => {
    try {
        const response = await axios.patch(
            `${serverEndpoint}/groups/members/remove`,
            {
                groupId: group._id,
                emails: [emailToRemove]
            },
            { withCredentials: true }
        );
        // Refresh the UI instantly via the parent's state 
        onUpdate(response.data); 
    } catch (error) {
        console.error("Error removing member:", error);
        setErrors({ message: 'Unable to remove member' });
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 position-relative">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="fw-bold">{group.name}</h5>
            <button className="btn btn-sm btn-link p-0 text-decoration-none" onClick={handleShowMember}>
               {group.membersEmail.length} Members | {showMembers ? "Hide" : "Show"} Members
            </button>
          </div>
        </div>
        
        <p className="mt-2 text-muted">{group.description}</p>
        
        {showMembers && (
           <div className="rounded-3 p-3 mb-3 border bg-light">
              <h6 className="small fw-bold mb-3">Members in this Group</h6>
              {group.membersEmail.map((member, index) => (
                 <div key={index} className="d-flex justify-content-between align-items-center mb-2 small">
                    <span>{index + 1}. {member}</span>
                    <button 
                        className="btn btn-sm text-danger p-0" 
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => handleRemoveMember(member)}
                    >
                        Remove
                    </button>
                 </div>
              ))}

              {/* Add Member Input Section  */}
              <div className="mt-3 pt-3 border-top">
                 <label className="form-label extra-small fw-bold text-secondary">Add Member</label>
                 <div className="input-group input-group-sm">
                    <input 
                        type="email" 
                        className="form-control border-end-0" 
                        placeholder="Email address"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                    />
                    <button 
                        className="btn btn-primary px-3" 
                        onClick={handleAddMember}
                    >
                        Add
                    </button>
                 </div>
                 {errors.message && <div className="text-danger extra-small mt-1">{errors.message}</div>}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

export default GroupCard;