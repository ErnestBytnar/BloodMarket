import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [username, setUsername] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/offers/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Fetched products:', response.data);
                setProducts(response.data);
            } catch (error) {
                console.error('Błąd ładowania produktów:', error);
            }
        };

       const fetchUser = async () => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/user/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Fetched user:', response.data);
        localStorage.setItem('user', JSON.stringify(response.data)); // <<< TO DODAJ
        setUsername(response.data.username);
    } catch (error) {
        console.error('Błąd ładowania użytkownika:', error);
        navigate('/login');
    }
};


        fetchProducts();
        fetchUser();
    }, [navigate]);

    const handleAddProduct = () => {
        navigate('/add');
    };

   const handleBuyProduct = async (offerId) => {

    try {
        const token = localStorage.getItem('access_token');
        const userRes = await axios.get('http://127.0.0.1:8000/api/user/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const buyerId = userRes.data.id;

        // Wyślij żądanie do API, aby wykonać transakcję
        const response = await axios.post('http://127.0.0.1:8000/api/transactions/make/', {
            offer_id: offerId,
            buyer_id: buyerId,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Jeśli transakcja się udała, usuń ofertę z widoku
        setProducts(prevProducts =>
            prevProducts.filter(product => product.id !== offerId) // Usuwamy ofertę, która została kupiona
        );


        alert('Zakup udany!');
    } catch (error) {
        console.error('Błąd zakupu:', error);
        alert('Nie udało się kupić oferty.');
    }

};




    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pl-PL', options);
    };

    const filteredProducts = products.filter(product => {
        if (!product.available) return false;
        const productName = product.user?.username ? product.user.username.toLowerCase() : '';
        const productBloodGroup = product.blood_type ? `${product.blood_type.types} ${product.blood_type.rh_factor}`.toLowerCase() : '';
        const productLocation = product.location ? product.location.toLowerCase() : '';
        const searchLowerCase = searchTerm.toLowerCase();

        return (
            productName.includes(searchLowerCase) ||
            productBloodGroup.includes(searchLowerCase) ||
            productLocation.includes(searchLowerCase)
        );
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOption === 'price_asc') {
            return a.total_price - b.total_price;
        } else if (sortOption === 'price_desc') {
            return b.total_price - a.total_price;
        } else if (sortOption === 'date_newest') {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortOption === 'date_oldest') {
            return new Date(a.created_at) - new Date(b.created_at);
        }
        return 0;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Cześć, {username}!</h1>
    
            <div className={styles.topBar}>
                <input
                    type="text"
                    placeholder="Szukaj po nazwie użytkownika, grupie krwi lub lokalizacji..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Sortuj</option>
                    <option value="price_asc">Cena rosnąco</option>
                    <option value="price_desc">Cena malejąco</option>
                    <option value="date_newest">Najnowsze</option>
                    <option value="date_oldest">Najstarsze</option>
                </select>
                <button onClick={handleAddProduct} className={styles.addButton}>
                    Dodaj ofertę
                </button>
            </div>
    
            <h2 className={styles.subtitle}>Dostępne oferty:</h2>
    
            <div className={styles.grid}>
                {currentProducts.length > 0 ? (
                    currentProducts.map(product => (
                        <div key={product.id} className={styles.card}>
                            <h3 className={styles.productName}>{product.user?.username || 'Anonim'}</h3>
                            <p className={styles.productBlood}>
                                Grupa: {product.blood_type ? `${product.blood_type.types} ${product.blood_type.rh_factor}` : 'Nieznana'}
                            </p>
                            <p className={styles.productLocation}>Lokalizacja: {product.location}</p>
                            <p className={styles.productPrice}>{product.total_price} PLN</p>
                            <p className={styles.productDescription}>Data dodania: {formatDate(product.created_at)}</p>
                            <button onClick={() => handleBuyProduct(product.id)} className={styles.buyButton}>
                                Kup
                            </button>
                        </div>
                    ))
                ) : (
                    <p className={styles.noResults}>Brak wyników.</p>
                )}
            </div>
    
            <div className={styles.pagination}>
                {Array.from({ length: Math.ceil(sortedProducts.length / productsPerPage) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
    
};

export default HomePage;
