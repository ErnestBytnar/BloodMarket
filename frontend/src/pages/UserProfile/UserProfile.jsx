import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserPage.module.css';

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

    if (!user) return <div className={styles.userprofileContainer}>Ładowanie profilu...</div>;

    return (
    <div className={styles.userprofileContainer}>
        <h1 className={styles.userprofileTitle}>Profil użytkownika: {user.username}</h1>

        <div className={styles.userprofileProfileSection}>
            <img
                src="https://via.placeholder.com/150"
                alt="Profil"
                className={styles.userprofileProfileImage}
            />
            <div>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID użytkownika:</strong> {user.id}</p>
                <p><strong>Data utworzenia:</strong> {new Date(user.date_joined).toLocaleDateString('pl-PL')}</p>
            </div>
        </div>

        <div className={styles.userprofileStatsBox}>
            <h2>Statystyki</h2>
            <p>Wystawionych ofert: {myOffers.length}</p>
            <p>Sprzedanych ofert: {myOffers.filter(o => !o.available).length}</p>
            <p>Dostępnych: {myOffers.filter(o => o.available).length}</p>
        </div>

        <div className={styles.userprofileOffersSection}>
            <h2>Moje oferty:</h2>
            <div className={styles.userprofileGrid}>
                {myOffers.length > 0 ? (
                    myOffers.map((offer) => (
                        <div key={offer.id} className={styles.userprofileCard}>
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

export default UserProfile;
