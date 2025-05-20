import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import styles from "./AdminPage.module.css";

const API_URL = process.env.REACT_APP_API_URL;

const AdminPage = () => {
    const { user, loading } = useAuth();
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
const fetchUsers = async () => {
    try{
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/users/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }

        });

        if (!response.ok) {
            throw new Error(`Błąd ${response.status} podczas pobierania użytkowników`);
        }

        const data = await response.json();
        setUsers(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setFetching(false);
    }
};


        if (user && user.groups.includes("Admin")) {
            fetchUsers();
        }
    }, [user]);

    if (loading || fetching) {
        return <div>Loading...</div>;
    }

    if (!user || !user.groups.includes("Admin")) {
        return <div>Brak dostępu - tylko dla administratorów</div>;
    }

    if (error) {
        return <div>Błąd: {error}</div>;
    }

return (
    <div className={styles.container}>
        <h1>Witaj, Admin!</h1>
        <h2>Lista użytkowników:</h2>
        <ul>
            {users.map((u) => (
                <li key={u.id}>
                    {u.username} - {u.email}
                </li>
            ))}
        </ul>
    </div>
);
};

export default AdminPage;
