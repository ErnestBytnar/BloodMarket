import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ImagePage.module.css';

const ImagePage = () => {
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState(null);  // Stan do przechowywania błędu
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get(`http://127.0.0.1:8000/api/offers/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.image) {
                    setImageUrl(response.data.image);
                    setError(null);  // Reset błędu, gdy obrazek jest dostępny
                } else {
                    setError('Brak grafiki dla tej oferty.');
                }
            } catch (error) {
                console.error('Błąd ładowania grafiki:', error);
                setError('Błąd ładowania grafiki. Spróbuj ponownie później.');
            }
        };

        fetchImage();
    }, [id, navigate]);

    return (
        <div className={styles.container}>
            <button onClick={() => navigate('/dashboard')} className={styles.backButton}>Wróć</button>

            {error && (
                <div className={styles.errorMessage}>{error}</div>  // Wyświetlamy komunikat o błędzie
            )}

            {imageUrl ? (
                <img src={`http://127.0.0.1:8000${imageUrl}`} alt="Zdjęcie oferty" className={styles.image} />
            ) : (
                !error && <p className={styles.noImage}>Ładowanie zdjęcia...</p>  // Tylko jeśli nie ma błędu
            )}
        </div>
    );
};

export default ImagePage;
