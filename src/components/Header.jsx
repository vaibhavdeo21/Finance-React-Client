import { Link } from "react-router-dom";

function Header() {
  return (
    // bg-black: Bootstrap class for black background
    // border-bottom border-warning: Adds the Gold line at the bottom
    <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-warning">
      <div className="container-fluid">
        {/* text-warning: Makes text Gold */}
        <Link className="navbar-brand fw-bold text-warning" to="/">
          FinanceApp 💰
        </Link>
        
        <button
          className="navbar-toggler border-warning" // Gold border for button
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          {/* We use inline style here just to force the icon color if needed, 
              or rely on navbar-dark to make it light/visible */}
          <span className="navbar-toggler-icon" />
        </button>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-warning" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-warning" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-warning" to="/register">Register</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;