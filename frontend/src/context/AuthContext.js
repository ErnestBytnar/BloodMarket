import { createContext, useState, useContext, useEffect } from "react";
const API_URL = process.env.REACT_APP_API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("access_token") || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/user/`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const userData = await response.json();
                    if (response.ok) {
                        setUser(userData);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
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
                throw new Error("Błąd logowania");
            }

            localStorage.setItem("access_token", data.access);
            setToken(data.access);

            const userResponse = await fetch(`${API_URL}/user/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.access}`,
                },
            });

            const userData = await userResponse.json();
            if (userResponse.ok) {
                setUser(userData);
            }

            return true;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, loading, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};