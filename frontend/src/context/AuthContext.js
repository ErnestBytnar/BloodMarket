import { createContext, useState, useContext, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("access_token") || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/user/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    console.warn("Błąd autoryzacji:", response.status);
                }
            } catch (error) {
                console.error("Błąd pobierania użytkownika:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/token/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                const error = new Error(data.detail || "Za dużo prób logowania");
                error.status = response.status;
                error.data = data;
                throw error;
            }

            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh", data.refresh);
            setToken(data.access);

            // Natychmiastowe pobranie użytkownika
            const userResponse = await fetch(`${API_URL}/user/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.access}`,
                },
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                setUser(userData);
            }

            return true;
        } catch (error) {
            console.error("Błąd logowania:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh");
        setToken(null);
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
