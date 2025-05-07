// UserProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [myOffers, setMyOffers] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const resUser = await axios.get('http://127.0.0.1:8000/api/user/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(resUser.data);

                const resOffers = await axios.get('http://127.0.0.1:8000/api/offers/', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const myUserOffers = resOffers.data.filter(
                    (offer) => offer.user?.id === resUser.data.id
                );
                setMyOffers(myUserOffers);
            } catch (err) {
                console.error('Błąd ładowania profilu:', err);
            }
        };

        fetchUserData();
    }, []);

    if (!user) return <div style={styles.container}>Ładowanie profilu...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Profil użytkownika: {user.username}</h1>

            <div style={styles.profileSection}>
                <img
                    src="https://via.placeholder.com/150"
                    alt="Profil"
                    style={styles.profileImage}
                />
                <div>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>ID użytkownika:</strong> {user.id}</p>
                    <p><strong>Data utworzenia:</strong> {new Date(user.date_joined).toLocaleDateString('pl-PL')}</p>
                </div>
            </div>

            <div style={styles.statsBox}>
                <h2>Statystyki</h2>
                <p>Wystawionych ofert: {myOffers.length}</p>
                <p>Sprzedanych ofert: {myOffers.filter(o => !o.available).length}</p>
                <p>Dostępnych: {myOffers.filter(o => o.available).length}</p>
            </div>

            <div style={styles.offersSection}>
                <h2>Moje oferty:</h2>
                <div style={styles.grid}>
                    {myOffers.length > 0 ? (
                        myOffers.map((offer) => (
                            <div key={offer.id} style={styles.card}>
                                <p><strong>Grupa:</strong> {offer.blood_type?.types} {offer.blood_type?.rh_factor}</p>
                                <p><strong>Cena:</strong> {offer.total_price} PLN</p>
                                <p><strong>Dostępność:</strong> {offer.available ? 'Dostępna' : 'Sprzedana'}</p>
                                <p><strong>Lokalizacja:</strong> {offer.location}</p>
                                <p><strong>Dodano:</strong> {new Date(offer.created_at).toLocaleDateString('pl-PL')}</p>
                            </div>
                        ))
                    ) : (
                        <p>Brak wystawionych ofert.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#0d0d0d',
        color: 'white',
        padding: '20px',
        fontFamily: 'monospace',
        minHeight: '100vh',
    },
    title: {
        fontSize: '28px',
        color: '#ff0000',
        marginBottom: '20px',
    },
    profileSection: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        border: '1px solid #ff0000',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
    },
    profileImage: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        border: '3px solid #ff0000',
        objectFit: 'cover',
    },
    statsBox: {
        backgroundColor: '#1a1a1a',
        border: '2px solid #ff0000',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 0 10px #ff0000',
    },
    offersSection: {
        marginTop: '20px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '10px',
    },
    card: {
        backgroundColor: '#1a1a1a',
        border: '1px solid #ff0000',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 0 8px #ff0000',
    },
};

export default UserProfile;
