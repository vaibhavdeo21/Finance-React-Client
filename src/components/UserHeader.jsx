import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function UserHeader() {
    const user = useSelector((state) => state.userDetails);
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path
            ? "bg-dark text-white shadow-sm fw-bold rounded-2 px-3" 
            : "text-dark fw-bold"; 

    return (
        <nav className="navbar navbar-expand-lg bg-white sticky-top border-bottom shadow-sm py-2">
            <div className="container">
                {/* Brand Logo */}
                <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to="/dashboard">
                    <span style={{ color: "var(--gold-primary)" }}>Merge</span>Money
                </Link>

                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#userNavbar"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="userNavbar">
                    {/* Primary App Navigation */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        {/* Add more nav items here if needed */}
                    </ul>

                    {/* User Profile Dropdown */}
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link dropdown-toggle d-flex align-items-center bg-light rounded-pill px-3 py-1 border shadow-sm"
                                to="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <div
                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2 shadow-sm"
                                    style={{
                                        width: "28px",
                                        height: "28px",
                                        fontSize: "12px",
                                    }}
                                >
                                    {user?.name
                                        ? user.name.charAt(0).toUpperCase()
                                        : "U"}
                                </div>
                                <span className="text-dark fw-bold small">
                                    {user ? user.name : "Account"}
                                </span>
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3 p-2">
                                <li
                                    className="px-3 py-2 border-bottom mb-2"
                                    style={{ minWidth: "220px" }}
                                >
                                    <p className="mb-0 extra-small fw-bold text-muted text-uppercase ls-1">
                                        Signed in as
                                    </p>
                                    <p className="mb-0 small fw-bold text-dark text-truncate">
                                        {user?.email}
                                    </p>
                                </li>

                                <li>
                                    <Link className={`dropdown-item py-2 rounded-2 d-flex align-items-center mb-1 ${isActive("/profile")}`} to="/profile">
                                        <i className="bi bi-person-circle me-2 fs-6"></i> My Profile
                                    </Link>
                                </li>

                                <li>
                                    <Link className={`dropdown-item py-2 rounded-2 d-flex align-items-center mb-1 ${isActive("/manage-users")}`} to="/manage-users">
                                        <i className="bi bi-people-fill me-2 fs-6"></i> Manage Users
                                    </Link>
                                </li>

                                <li>
                                    <Link className={`dropdown-item py-2 rounded-2 d-flex align-items-center mb-1 ${isActive("/manage-payments")}`} to="/manage-payments">
                                        <i className="bi bi-credit-card-fill me-2 fs-6"></i> Payments
                                    </Link>
                                </li>

                                {/* NEW: Manage Subscription Link */}
                                <li>
                                    <Link className={`dropdown-item py-2 rounded-2 d-flex align-items-center mb-1 ${isActive("/manage-subscription")}`} to="/manage-subscription">
                                        <i className="bi bi-person-check-fill me-2 fs-6"></i> Manage Subscriptions
                                    </Link>
                                </li>

                                <li>
                                    <hr className="dropdown-divider my-2" />
                                </li>
                                <li>
                                    <Link
                                        className="dropdown-item py-2 text-danger fw-bold d-flex align-items-center rounded-2"
                                        to="/logout"
                                    >
                                        <i className="bi bi-box-arrow-right me-2 fs-6"></i>{" "}
                                        Sign Out
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default UserHeader;