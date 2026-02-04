import { useSelector } from 'react-redux';

function Dashboard() {
  // Get user from Redux store
  const user = useSelector((state) => state.userDetails);

  return (
    <div className="container text-center mt-5">
      {/* SAFE CHECK: Only show name if user exists */}
      {user ? (
        <div className="card p-4 shadow-sm">
           <h4>Welcome Back, <span className="text-warning">{user.name}</span>! 👋</h4>
           <p className="text-muted">{user.email}</p>
        </div>
      ) : (
        /* Fallback if user is null (shouldn't happen if protected, but safe to have) */
        <h4>Loading Profile...</h4>
      )}
    </div>
  );
}

export default Dashboard;