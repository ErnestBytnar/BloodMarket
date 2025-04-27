import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddOfferPage = () => {
    const navigate = useNavigate();
    const [bloodTypes, setBloodTypes] = useState([]);
    const [bloodTypeId, setBloodTypeId] = useState('');
    const [volume, setVolume] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Pobierz grupy krwi
                const bloodTypesResponse = await axios.get('http://127.0.0.1:8000/api/blood-types/');
                setBloodTypes(bloodTypesResponse.data);

                // Pobierz dane użytkownika
                const userResponse = await axios.get('http://127.0.0.1:8000/api/user/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserId(userResponse.data.id);
            } catch (error) {
                console.error('Error fetching data:', error);
                navigate('/login');
            }
        };

        fetchData();
    }, [navigate]);

    const handleAddOffer = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                navigate('/login');
                return;
            }

            const formData = new FormData();
            formData.append('user_id', userId);
            formData.append('blood_type_id', bloodTypeId);
            formData.append('volume_ml', volume);
            formData.append('total_price', price);
            formData.append('location', location);
            if (image) {
                formData.append('image', image);
            }

            await axios.post('http://127.0.0.1:8000/api/offers/create/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('Oferta dodana pomyślnie!');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            console.error('Error adding offer:', error);
            setError(error.response?.data?.message || 'Wystąpił błąd podczas dodawania oferty');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleAddOffer} style={styles.form}>
                <h2 style={styles.title}>Dodaj ofertę</h2>

                <select
                    value={bloodTypeId}
                    onChange={(e) => setBloodTypeId(e.target.value)}
                    style={styles.input}
                    required
                >
                    <option value="">Wybierz grupę krwi</option>
                    {bloodTypes.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.types} {type.rh_factor}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Ilość krwi (ml)"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    style={styles.input}
                    required
                    min="1"
                />

                <input
                    type="number"
                    placeholder="Cena (PLN)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={styles.input}
                    required
                    min="0.01"
                    step="0.01"
                />

                <input
                    type="text"
                    placeholder="Lokalizacja"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={styles.input}
                    required
                />

                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    style={styles.input}
                    accept="image/*"
                />

                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                <button type="submit" style={styles.button}>
                    Dodaj ofertę
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#0d0d0d',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    },
    form: {
        backgroundColor: '#1a1a1a',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 0 10px #ff0000',
        display: 'flex',
        flexDirection: 'column',
        width: '350px',
    },
    title: {
        color: '#ff0000',
        textAlign: 'center',
        marginBottom: '20px',
        fontFamily: 'monospace',
    },
    input: {
        backgroundColor: '#333',
        border: '1px solid #555',
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '4px',
        color: 'white',
    },
    button: {
        backgroundColor: '#ff0000',
        border: 'none',
        padding: '10px',
        borderRadius: '4px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    error: {
        color: '#ff6666',
        marginBottom: '10px',
        textAlign: 'center',
    },
    success: {
        color: '#66ff66',
        marginBottom: '10px',
        textAlign: 'center',
    }
};

export default AddOfferPage;