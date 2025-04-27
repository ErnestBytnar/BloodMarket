const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Błąd logowania');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const registerUser = async (username, email, password) => {
    try {
        const response = await fetch(`${API_URL}/user/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            throw new Error('Błąd rejestracji');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Rejestracja error:', error);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login'; // przekierowanie do strony logowania
};
