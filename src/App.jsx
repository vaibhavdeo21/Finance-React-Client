import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppLayout from "./components/AppLayout";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import Logout from "./pages/Logout";
import UserLayout from "./components/UserLayout";
import axios from "axios";
import { serverEndpoint } from "./config/appConfig";
import { useSelector, useDispatch } from "react-redux";
import { SET_USER } from "./redux/user/action";
import Groups from "./pages/Groups";
import Dashboard from "./pages/Dashboard"; 
import GroupExpenses from "./pages/GroupExpenses";
import ManageUsers from "./pages/ManageUsers";
import ProtectedRoute from "./rbac/ProtectedRoute";
import UnauthorizedAccess from "./components/errors/UnauthorizedAccess";
import ManagePayments from "./pages/ManagePayments";
import ManageSubscription from "./pages/ManageSubscription"; 

function App() {
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);
    const [loading, setLoading] = useState(true);

    const isUserLoggedIn = async () => {
        try {
            const response = await axios.post(
                `${serverEndpoint}/auth/is-user-logged-in`,
                {},
                { withCredentials: true }
            );

            dispatch({
                type: SET_USER,
                payload: response.data.user,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        isUserLoggedIn();
    }, []);

    if (loading) {
        return (
            <div className="container text-center">
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    userDetails ? (
                        <Navigate to="/dashboard" />
                    ) : (
                        <AppLayout>
                            <Home />
                        </AppLayout>
                    )
                }
            />

            <Route
                path="/profile"
                element={
                    userDetails ? (
                        <UserLayout>
                            <Profile />
                        </UserLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/login"
                element={
                    userDetails ? (
                        <Navigate to="/dashboard" />
                    ) : (
                        <AppLayout>
                            <Login />
                        </AppLayout>
                    )
                }
            />
            <Route
                path="/register"
                element={
                    userDetails ? (
                        <Navigate to="/dashboard" />
                    ) : (
                        <AppLayout>
                            <Register />
                        </AppLayout>
                    )
                }
            />

            {/* UPDATED: Points to Dashboard.jsx for Stats + Groups view */}
            <Route
                path="/dashboard"
                element={
                    userDetails ? (
                        <UserLayout>
                            <Dashboard />
                        </UserLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            {/* OPTIONAL: Keep a separate route if you want a full-page groups list */}
            <Route
                path="/groups"
                element={
                    userDetails ? (
                        <UserLayout>
                            <Groups />
                        </UserLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            <Route
                path="/groups/:groupId"
                element={
                    userDetails ? (
                        <UserLayout>
                            <GroupExpenses />
                        </UserLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            <Route
                path="/manage-users"
                element={
                    userDetails ? (
                        <ProtectedRoute roles={["admin"]}>
                            <UserLayout>
                                <ManageUsers />
                            </UserLayout>
                        </ProtectedRoute>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            <Route
                path="/manage-payments"
                element={
                    userDetails ? (
                        <ProtectedRoute roles={["admin"]}>
                            <UserLayout>
                                <ManagePayments />
                            </UserLayout>
                        </ProtectedRoute>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            
            {/* NEW: Manage Subscription Route */}
            <Route
                path="/manage-subscription"
                element={
                    userDetails ? (
                        <ProtectedRoute roles={["admin"]}>
                            <UserLayout>
                                <ManageSubscription />
                            </UserLayout>
                        </ProtectedRoute>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            <Route
                path="/unauthorized-access"
                element={
                    userDetails ? (
                        <UserLayout>
                            <UnauthorizedAccess />
                        </UserLayout>
                    ) : (
                        <AppLayout>
                            <UnauthorizedAccess />
                        </AppLayout>
                    )
                }
            />

            <Route
                path="/logout"
                element={userDetails ? <Logout /> : <Navigate to="/login" />}
            />
        </Routes>
    );
}

export default App;