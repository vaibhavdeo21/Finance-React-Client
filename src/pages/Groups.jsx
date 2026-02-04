import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useEffect, useState } from "react";
import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/CreateGroupModal"; // Import the modal

function Groups() {
  const [groups, setGroups] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false); // State for modal visibility

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `${serverEndpoint}/groups/my-groups`,
        { withCredentials: true }
      );
      setGroups(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Handler to close modal and refresh list
  const handleCloseModal = () => {
    setShowCreateModal(false);
    fetchGroups(); // Refresh data to show the new group
  };

  if (loading) {
    return (
      <div className="container p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Your Groups</h2>
          <p className="text-muted">Manage your shared expenses and split expenses</p>
        </div>
        <button 
          className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          Create Group
        </button>
      </div>

      {/* Modal Component */}
      <CreateGroupModal 
        show={showCreateModal} 
        onHide={handleCloseModal} 
      />

      {/* Groups List */}
      {groups && groups.length === 0 && (
         <div className="text-center mt-5">
            <p className="text-muted">No groups found, Start by creating one!</p>
         </div>
      )}
      
      {groups && groups.length > 0 && (
        <div className="row g-4">
          {groups.map((group) => (
             <div className="col-md-6 col-lg-4" key={group._id}>
                <GroupCard group={group} />
             </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Groups;