import { useState,useEffect } from "react"
import { Link } from "react-router-dom";
import { logout } from "../../api/auth";
import { useAuth } from "./../../context/AuthContext";
import "./Navbar.css";


const Navbar = () => {
    const { user } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("access_token");
            setIsAuthenticated(!!token);
        };

                const handleAuthChange = () => {
                    checkAuth();
                };


        checkAuth();

        window.addEventListener("authChange", handleAuthChange);

        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, []);
    const handleLogout = () =>{
        logout();
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);

        const event = new Event("authChange");
        window.dispatchEvent(event);
    };

    return(

        <nav>
            <h2>Blood Market</h2>
            <div>
                {isAuthenticated ? (
                    <>
                    <Link to="/dashboard">Strona główna</Link>
                    {user && user.groups?.includes("Admin") && (
                            <Link to="/admin">Panel Administratora</Link>
                        )}
                    <button onClick={handleLogout}>Wyloguj się</button>
                    </>
                ):(
                    <>
                    <Link to="/login">Logowanie</Link>
                    <Link to="/register">Rejestracja</Link>
                    </>
                    
                    
                )
            }
            </div>
        </nav>
    );
};

export default Navbar;