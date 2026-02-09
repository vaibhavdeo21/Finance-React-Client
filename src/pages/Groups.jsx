import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useEffect, useState } from "react";
import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/CreateGroupModal";
import { usePermission } from "../rbac/userPermissions";

function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit] = useState(3); // Set limit to 3 as per PDF requirement

    const permissions = usePermission();

    const fetchGroups = async (page = 1) => {
        try {
            setLoading(true);
            // Pass page and limit as query parameters
            const response = await axios.get(
                `${serverEndpoint}/groups/my-groups?page=${page}&limit=${limit}`,
                { withCredentials: true }
            );
            
            // Update state with paginated data
            setGroups(response.data.groups);
            setTotalPages(response.data.pagination.totalPages);
            setCurrentPage(response.data.pagination.currentPage);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGroupUpdateSuccess = (data) => {
        // Refresh the current page to show updates
        fetchGroups(currentPage);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchGroups(newPage);
        }
    };

    useEffect(() => {
        // Fetch the first page on initial load
        fetchGroups(1);
    }, []);

    if (loading) {
        return (
            <div
                className="container p-5 d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: "60vh" }}
            >
                <div
                    className="spinner-grow text-primary"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted fw-medium">
                    Syncing your circles...
                </p>
            </div>
        );
    }

    return (
        <div className="container py-5 px-4 px-md-5">
            <div className="row align-items-center mb-5">
                <div className="col-md-8 text-center text-md-start mb-3 mb-md-0">
                    <h2 className="fw-bold text-dark display-6">
                        Manage <span className="text-primary">Groups</span>
                    </h2>
                    <p className="text-muted mb-0">
                        View balances, invite friends, and settle shared
                        expenses in one click.
                    </p>
                </div>
                <div className="col-md-4 text-center text-md-end">
                    {permissions.canCreateGroups && (
                        <button
                            className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm"
                            onClick={() => setShow(true)}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            New Group
                        </button>
                    )}
                </div>
            </div>

            <hr className="mb-5 opacity-10" />

            {/* Empty State */}
            {groups.length === 0 && (
                <div className="text-center py-5 bg-light rounded-5 border border-dashed border-primary border-opacity-25 shadow-inner">
                    <div className="bg-white rounded-circle d-inline-flex p-4 mb-4 shadow-sm">
                        <i
                            className="bi bi-people text-primary"
                            style={{ fontSize: "3rem" }}
                        ></i>
                    </div>
                    <h4 className="fw-bold">No Groups Found</h4>
                    <p
                        className="text-muted mx-auto mb-4"
                        style={{ maxWidth: "400px" }}
                    >
                        You haven't joined any groups yet. Create a group to
                        start splitting bills with your friends or roommates!
                    </p>
                    {permissions.canCreateGroups && (
                        <button
                            className="btn btn-outline-primary rounded-pill px-4"
                            onClick={() => setShow(true)}
                        >
                            Get Started
                        </button>
                    )}
                </div>
            )}

            {/* Groups Grid */}
            {groups.length > 0 && (
                <div className="row g-4 animate__animated animate__fadeIn">
                    {groups.map((group) => (
                        <div className="col-md-6 col-lg-4" key={group._id}>
                            <GroupCard
                                group={group}
                                onUpdate={handleGroupUpdateSuccess}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {groups.length > 0 && totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                    <nav aria-label="Page navigation">
                        <ul className="pagination">
                            {/* Previous Button */}
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    aria-label="Previous"
                                >
                                    <span aria-hidden="true">&laquo;</span>
                                </button>
                            </li>

                            {/* Page Numbers */}
                            {[...Array(totalPages)].map((_, index) => (
                                <li
                                    key={index + 1}
                                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}

                            {/* Next Button */}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    aria-label="Next"
                                >
                                    <span aria-hidden="true">&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            <CreateGroupModal
                show={show}
                onHide={() => setShow(false)}
                onSuccess={handleGroupUpdateSuccess}
            />
        </div>
    );
}

export default Groups;