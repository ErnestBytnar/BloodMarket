import { useContext,useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("access_token"));

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

 


    return children;
};

export default ProtectedRoute;
