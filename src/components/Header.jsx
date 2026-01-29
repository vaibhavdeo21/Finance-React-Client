import { Link } from "react-router-dom";

function Header() {
    return (
        <>
            {/*====== NAVBAR ONE PART START ======*/}
            <section className="navbar-area navbar-one">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-lg">
                                <a className="navbar-brand" href="javascript:void(0)">
                                    <img
                                        src="https://cdn.ayroui.com/1.0/images/white-logo.svg"
                                        alt="Logo"
                                    />
                                </a>
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#navbarOne"
                                    aria-controls="navbarOne"
                                    aria-expanded="false"
                                    aria-label="Toggle navigation"
                                >
                                    <span className="toggler-icon" />
                                    <span className="toggler-icon" />
                                    <span className="toggler-icon" />
                                </button>
                                <div
                                    className="collapse navbar-collapse sub-menu-bar"
                                    id="navbarOne"
                                >
                                    <ul className="navbar-nav m-auto">
                                        <li className="nav-item">
                                            <a
                                                className="page-scroll active"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#sub-nav1"
                                                aria-controls="sub-nav1"
                                                aria-expanded="false"
                                                aria-label="Toggle navigation"
                                                href="javascript:void(0)"
                                            >
                                                About
                                                <div className="sub-nav-toggler">
                                                    <span>
                                                        <i className="lni lni-chevron-down" />
                                                    </span>
                                                </div>
                                            </a>
                                            <ul className="sub-menu collapse" id="sub-nav1">
                                                <li>
                                                    <a href="javascript:void(0)">About Us</a>
                                                </li>
                                                <li>
                                                    <a
                                                        className="page-scroll"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#sub-nav2"
                                                        aria-controls="sub-nav2"
                                                        aria-expanded="false"
                                                        aria-label="Toggle navigation"
                                                        href="javascript:void(0)"
                                                    >
                                                        Our Portfolio
                                                        <div className="sub-nav-toggler">
                                                            <span>
                                                                <i className="lni lni-chevron-down" />
                                                            </span>
                                                        </div>
                                                    </a>
                                                    <ul className="sub-menu collapse" id="sub-nav2">
                                                        <li>
                                                            <a href="javascript:void(0)">Portfolio Style 1</a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0)">Portfolio Style 2</a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:void(0)">Portfolio Style 3</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <a href="javascript:void(0)">Our Teams</a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="nav-item">
                                            <a href="javascript:void(0)">Services</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="javascript:void(0)">Resources</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="javascript:void(0)">Support</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="navbar-btn d-none d-sm-inline-block">
                                    <ul>
                                        <li>
                                            <a
                                                className="btn primary-btn-outline"
                                                href="javascript:void(0)"
                                            >
                                                Sign In
                                            </a>
                                        </li>
                                        <li>
                                            <a className="btn primary-btn" href="javascript:void(0)">
                                                Sign Up
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                            {/* navbar */}
                        </div>
                    </div>
                    {/* row */}
                </div>
                {/* container */}
            </section>
            {/*====== NAVBAR ONE PART ENDS ======*/}
            {/*====== Bootstrap js ======*/}
        </>

    );
}

export default Header;