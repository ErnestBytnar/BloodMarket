import { useAuth } from "../../context/AuthContext";
const AdminPage = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !user.groups.includes("Admin")) {
        return <div>Brak dostępu - tylko dla administratorów</div>;
    }

    return <div>Witaj, Admin!</div>;
};

export default AdminPage;