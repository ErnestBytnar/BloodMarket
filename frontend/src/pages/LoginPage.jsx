import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();  
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            const event = new Event("authChange");
            window.dispatchEvent(event)
            navigate("/main");
        }
    };

    return (
        <div>
            <h2>Logowanie</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Nazwa użytkownika" onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Hasło" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Zaloguj</button>
            </form>
        </div>
    );
};

export default LoginPage;
