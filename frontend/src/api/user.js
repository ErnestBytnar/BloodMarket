const API_URL = process.env.REACT_APP_API_URL;

export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${API_URL}/user/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Błąd przy pobieraniu danych użytkownika');
        }

        return await response.json();
    } catch (error) {
        console.error('Błąd przy pobieraniu danych użytkownika', error);
        return null;
    }
};
