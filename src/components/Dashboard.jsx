function Dashboard({user}) {
    return (
        <div className="container text-center">
            <h4>Welcome, {user.name}!</h4>
        </div>
    );
}

export default Dashboard;
