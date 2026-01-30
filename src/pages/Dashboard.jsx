function Dashboard({ user }) {
  return (
    <div className="container text-center">
      {/* Displays the name from the user object */}
      <h4>Welcome, {user.name}!</h4> 
    </div>
  );
}

export default Dashboard;