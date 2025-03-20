import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/");
            return;
        }

        fetch("http://127.0.0.1:8000/api/user/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch(() => {
                localStorage.removeItem("access_token");
                navigate("/"); 
                
            });
    }, [navigate]);

    return (
        <div>
            <h1>Dashboard</h1>
            {user ? (
                <p>Witaj, {user.username}!</p>
            ) : (
                <p>Ładowanie danych użytkownika...</p>
            )}
        </div>
    );
};

export default Dashboard;
