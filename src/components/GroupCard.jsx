import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function GroupCard({ group, onUpdate }) {
  const [showMembers, setShowMembers] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  // unused errors state kept to match PDF structure if needed later
  const [errors, setErrors] = useState({}); 

  const handleShowMember = () => {
    setShowMembers(!showMembers);
  };

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
        // Update the parent state with the new group data
        onUpdate(response.data);
        setMemberEmail(''); // Clear input
    } catch (error) {
        console.log(error);
        setErrors({ message: 'Unable to add member' });
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 position-relative">
      <div className="card-body p-4">
        <div>
          <h5>{group.name}</h5>
          <button className="btn btn-sm btn-link p-0" onClick={handleShowMember}>
             {group.membersEmail.length} Members | {showMembers ? "Hide" : "Show"} Members
          </button>
        </div>
        
        <p>{group.description}</p>
        
        {showMembers && (
           <div className="rounded-3 p-3 mb-3 border">
              <h6>Members in this Group</h6>
              {group.membersEmail.map((member, index) => (
                 <div key={index}>{index + 1}. {member}</div>
              ))}

              {/* Add Member Section */}
              <div className="mb-3 mt-3">
                 <label className="form-label extra-small fw-bold text-secondary">Add Member</label>
                 <div className="input-group input-group-sm">
                    <input 
                        type="email" 
                        className="form-control border-end-0" 
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
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

export default GroupCard;