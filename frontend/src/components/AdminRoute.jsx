import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !user.groups.includes("Admin")) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default AdminRoute;