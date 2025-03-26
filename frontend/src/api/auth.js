

const API_URL = "http://127.0.0.1:8000/api";

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Nieprawidłowe dane logowania!");

    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh", data.refresh);
    return data;
};

export const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return null;

    const response = await fetch(`${API_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("access_token", data.access);
        return data.access;
    } else {
        logout();
        return null;
    }
};

export const registerUser = async (username, email, password) =>{
    try{
        console.log("Data being sent to the backend:", {
            username,
            email,
            password,
        });
        const response = await fetch(`${API_URL}/register/`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password
            }),
        });
        const data = await response.json();

        if(!response.ok){
            throw new Error(data.detail || "Błąd rejestracji");
        }
        return data;
    } catch (error){
        console.error("Błąd rejestracji", error);
        throw error;
    }
};


export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh");
    window.location.href="/login";
}

