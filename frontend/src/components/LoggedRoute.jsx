import { useState } from "react";
import { Navigate } from "react-router-dom";

const LoggedRoute = ({ children }) => {
    const [isAuthenticated] = useState(localStorage.getItem("access_token"));

    if (isAuthenticated) {
        return <Navigate to="/main" />;
    }

    return children;
};

export default LoggedRoute;