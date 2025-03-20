import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("access_token") || null);

    const login = async (username, password) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/token/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error("Błąd logowania");
            }

            const data = await response.json();
            localStorage.setItem("access_token", data.access);
            setToken(data.access);
            return true;  // Sukces logowania
        } catch (error) {
            console.error("Błąd logowania", error);
            return false; // Logowanie nie powiodło się
        }
    };

    return (
        <AuthContext.Provider value={{ token, login }}>
            {children}
        </AuthContext.Provider>
    );
};
