import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // dostosuj ścieżkę
import styles from "./LoginPage.module.css"; // jeśli masz style

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(form.username, form.password);
            navigate("/dashboard");
         } catch (error) {
                if (error.status === 429) {
                    setError(error.data?.detail || "Zbyt wiele prób logowania. Spróbuj ponownie za chwilę.");
                } else {
                    setError("Niepoprawne dane.");
                }
            };
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>Logowanie</h2>
                <input
                    type="text"
                    name="username"
                    placeholder="Nazwa użytkownika"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" className={styles.button}>Zaloguj się</button>

                {/* Link do rejestracji w obrębie formularza */}
                <p className={styles.registerText}>
                    Nie masz konta? <a href="/register" className={styles.registerLink}>Zarejestruj się</a>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
