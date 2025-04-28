import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        navigate('/add-product');
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
        <div style={styles.container}>
            <h1 style={styles.title}>Cześć, {username}!</h1>

            <div style={styles.topBar}>
                <input
                    type="text"
                    placeholder="Szukaj po nazwie użytkownika, grupie krwi lub lokalizacji..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={styles.select}
                >
                    <option value="">Sortuj</option>
                    <option value="price_asc">Cena rosnąco</option>
                    <option value="price_desc">Cena malejąco</option>
                    <option value="date_newest">Najnowsze</option>
                    <option value="date_oldest">Najstarsze</option>
                </select>
                <button onClick={handleAddProduct} style={styles.addButton}>
                    Dodaj ofertę
                </button>
            </div>

            <h2 style={styles.subtitle}>Dostępne oferty:</h2>

            <div style={styles.grid}>
                {currentProducts.length > 0 ? (
                    currentProducts.map(product => (
                        <div key={product.id} style={styles.card}>
                            <h3 style={styles.productName}>{product.user?.username || 'Anonim'}</h3>
                            <p style={styles.productBlood}>
                                Grupa: {product.blood_type ? `${product.blood_type.types} ${product.blood_type.rh_factor}` : 'Nieznana'}
                            </p>
                            <p style={styles.productLocation}>Lokalizacja: {product.location}</p>
                            <p style={styles.productPrice}>{product.total_price} PLN</p>
                            <p style={styles.productDescription}>Data dodania: {formatDate(product.created_at)}</p>
                            <button onClick={() => handleBuyProduct(product.id)} style={styles.buyButton}>
                                Kup
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={styles.noResults}>Brak wyników.</p>
                )}
            </div>

            <div style={styles.pagination}>
                {Array.from({ length: Math.ceil(sortedProducts.length / productsPerPage) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        style={{
                            ...styles.pageButton,
                            backgroundColor: currentPage === index + 1 ? '#ff0000' : '#1a1a1a'
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#0d0d0d',
        minHeight: '100vh',
        padding: '20px',
        color: 'white',
        fontFamily: 'monospace',
    },
    title: {
        color: '#ff0000',
        fontSize: '32px',
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap',
    },
    searchInput: {
        flex: '1 1 300px',
        padding: '10px',
        marginRight: '10px',
        backgroundColor: '#1a1a1a',
        border: '1px solid #ff0000',
        borderRadius: '4px',
        color: 'white',
    },
    select: {
        padding: '10px',
        backgroundColor: '#1a1a1a',
        border: '1px solid #ff0000',
        borderRadius: '4px',
        color: 'white',
        marginRight: '10px',
    },
    addButton: {
        backgroundColor: '#ff0000',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
    },
    subtitle: {
        color: '#ff4d4d',
        marginBottom: '10px',
        marginTop: '20px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#1a1a1a',
        border: '1px solid #ff0000',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 0 10px #ff0000',
    },
    productName: {
        fontSize: '20px',
        marginBottom: '10px',
    },
    productBlood: {
        color: '#ff4d4d',
        marginBottom: '5px',
    },
    productLocation: {
        color: '#ff6666',
        marginBottom: '5px',
    },
    productPrice: {
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    productDescription: {
        fontSize: '14px',
        color: '#ccc',
    },
    noResults: {
        textAlign: 'center',
        color: '#999',
        fontSize: '18px',
        marginTop: '40px',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    pageButton: {
        padding: '10px 15px',
        margin: '0 5px',
        backgroundColor: '#1a1a1a',
        border: '1px solid #ff0000',
        borderRadius: '4px',
        color: 'white',
        cursor: 'pointer',
    },
    buyButton: {
        marginTop: '10px',
        backgroundColor: '#ff0000',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
    }
};

export default HomePage;
