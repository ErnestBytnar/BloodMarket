import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import styles from './AddProductPage.module.css';

const AddOfferPage = () => {
    const navigate = useNavigate();
    const [bloodTypes, setBloodTypes] = useState([]);
    const [bloodTypeId, setBloodTypeId] = useState('');
    const [volume, setVolume] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('null');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userId, setUserId] = useState(null);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Pobierz grupy krwi
                const bloodTypesResponse = await axios.get('http://127.0.0.1:8000/api/blood-types/', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
                console.log('bloodTypesResponse', bloodTypesResponse.data); // debug
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

    useEffect(() => {
    const fetchCountries = async () => {
        try {
            const response = await fetch(
                "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
            );
            const data = await response.json();
            setCountries(data.countries);
            setSelectedCountry(data.userSelectValue);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    fetchCountries();
}, []);



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
            formData.append('blood_type_id', Number(bloodTypeId)); // <-- KONWERSJA NA LICZBĘ TUTAJ
            formData.append('volume_ml', volume);
            formData.append('total_price', price);
            formData.append('location', location.value);
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
    <div className={styles.container}>
        <form onSubmit={handleAddOffer} className={styles.form}>
            <h2 className={styles.title}>Dodaj ofertę</h2>

            <select
                value={bloodTypeId}
                onChange={(e) => setBloodTypeId(e.target.value)}
                className={styles.input}
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
                className={styles.input}
                required
                min="1"
            />

            <input
                type="number"
                placeholder="Cena (PLN)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.input}
                required
                min="0.01"
                step="0.01"
            />

            <Select
                options={countries}
                value={location}
                onChange={(selectedOption) => setLocation(selectedOption)}
                placeholder="Wybierz kraj"
                styles={{
                    control: (base) => ({
                        ...base,
                        backgroundColor: '#333',
                        borderColor: '#555',
                        color: 'white',
                        marginBottom: '15px',
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: 'white',
                    }),
                    menu: (base) => ({
                        ...base,
                        backgroundColor: '#1a1a1a',
                        color: 'white',
                    }),
                    option: (base, { isFocused }) => ({
                        ...base,
                        backgroundColor: isFocused ? '#555' : '#1a1a1a',
                        color: 'white',
                    }),
                }}
                required
            />

            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className={styles.input}
                accept="image/*"
            />

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <button type="submit" className={styles.button}>
                Dodaj ofertę
            </button>
        </form>
    </div>
);

};


export default AddOfferPage;