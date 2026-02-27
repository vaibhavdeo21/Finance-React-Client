import UserFooter from "./UserFooter";
import UserHeader from "./UserHeader";

function UserLayout({ children }) {
    return (
        <div style={{ 
            backgroundColor: "#FBFBFB", // High-end off-white
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column"
        }}>
            <UserHeader />
            {/* The main wrapper ensures all children pages are padded and professional */}
            <main className="flex-grow-1 py-5">
                <div className="container" style={{ maxWidth: "1200px" }}>
                    {children}
                </div>
            </main>
            <UserFooter />
        </div>
    );
}

export default UserLayout;