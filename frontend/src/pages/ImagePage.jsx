import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ImagePage = () => {
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
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
                } else {
                    alert('Brak grafiki dla tej oferty.');
                    navigate('/');
                }
            } catch (error) {
                console.error('Błąd ładowania grafiki:', error);
                navigate('/');
            }
        };

        fetchImage();
    }, [id, navigate]);

    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/dashboard')} style={styles.backButton}>Wróć</button>
            {imageUrl ? (
                <img src={`http://127.0.0.1:8000${imageUrl}`} alt="Zdjęcie oferty" style={styles.image} />
            ) : (
                <p style={styles.noImage}>Brak zdjęcia do wyświetlenia.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#0d0d0d',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px',
        color: 'white',
        fontFamily: 'monospace',
    },
    image: {
        maxWidth: '90%',
        maxHeight: '80vh',
        marginTop: '20px',
        borderRadius: '8px',
        border: '2px solid #ff0000',
    },
    backButton: {
        backgroundColor: '#ff0000',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    noImage: {
        marginTop: '20px',
        color: '#ccc',
    }
};

export default ImagePage;
