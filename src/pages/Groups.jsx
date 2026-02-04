import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useEffect, useState } from "react";
import GroupCard from "../components/GroupCard";

function Groups() {
  const [groups, setGroups] = useState(null);
  const [loading, setLoading] = useState(true);

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
      {groups && groups.length === 0 && (
         <div>
            <p>No groups found, Start by creating one!</p>
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