import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [username, setUsername] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
       const fetchProducts = async () => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login'); // Jeśli brak tokena, przekieruj do logowania
            return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/offers/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setProducts(response.data);
    } catch (error) {
        console.error('Błąd ładowania produktów:', error);
        if (error.response && error.response.status === 401) {
            // Token może być nieważny
            alert('Token wygasł lub jest nieprawidłowy. Zaloguj się ponownie.');
            localStorage.removeItem('access_token');
            navigate('/login');
        }
    }
};


        const fetchUser = async () => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login'); // Jeśli brak tokena, przekieruj do logowania
            return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/user/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        localStorage.setItem('user', JSON.stringify(response.data));
        setUsername(response.data.username);
    } catch (error) {
        console.error('Błąd ładowania użytkownika:', error);
        if (error.response && error.response.status === 401) {
            // Token wygasł lub jest nieprawidłowy
            alert('Twoja sesja wygasła. Proszę zaloguj się ponownie.');
            localStorage.removeItem('access_token');
            navigate('/login');
        } else {
            navigate('/login');
        }
    }
};


        fetchProducts();
        fetchUser();
    }, [navigate]);

    const handleAddProduct = () => {
        navigate('/add');
    };

    /*
     const handleBuyProduct = async (offerId) => {
        try {
            const token = localStorage.getItem('access_token');
            const userRes = await axios.get('http://127.0.0.1:8000/api/user/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const buyerId = userRes.data.id;

            await axios.post('http://127.0.0.1:8000/api/transactions/make/', {
                offer_id: offerId,
                buyer_id: buyerId,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setProducts(prevProducts =>
                prevProducts.filter(product => product.id !== offerId)
            );

            alert('Zakup udany!');
        } catch (error) {
            console.error('Błąd zakupu:', error);
            alert('Nie udało się kupić oferty.');
        }
    };
    */

   const handleBuyProduct = async (offerId) => {
  try {
    const token = localStorage.getItem('access_token');
    const offer = products.find(p => p.id === offerId);
    if (!offer) {
      alert('Oferta nie znaleziona');
      return;
    }

    // Zakładam, że w offer masz user_id jako obiekt albo przynajmniej jego id
    const otherUserId = offer.user_id?.id || offer.user_id;

    const response = await axios.post(
      'http://127.0.0.1:8000/api/privatechat/create_or_get_private_chat/',
      { other_user_id: otherUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const chatId = response.data.chat_id;
    if (chatId) {
      window.open(`/chat/${chatId}`, '_blank');
    } else {
      alert('Nie udało się utworzyć czatu');
    }
  } catch (error) {
    console.error('Błąd podczas tworzenia czatu:', error);
    alert('Błąd podczas tworzenia czatu');
  }
};





    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pl-PL', options);
    };

    const filteredProducts = products.filter(product => {
        if (!product.available) return false;
        const productName = product.user?.username?.toLowerCase() || '';
        const productBloodGroup = product.blood_type ? `${product.blood_type.types} ${product.blood_type.rh_factor}`.toLowerCase() : '';
        const productLocation = product.location?.toLowerCase() || '';
        const searchLowerCase = searchTerm.toLowerCase();

        return (
            productName.includes(searchLowerCase) ||
            productBloodGroup.includes(searchLowerCase) ||
            productLocation.includes(searchLowerCase)
        );
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOption === 'price_asc') return a.total_price - b.total_price;
        if (sortOption === 'price_desc') return b.total_price - a.total_price;
        if (sortOption === 'date_newest') return new Date(b.created_at) - new Date(a.created_at);
        if (sortOption === 'date_oldest') return new Date(a.created_at) - new Date(b.created_at);
        return 0;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
  {"Cześć, ".split("").map((char, i) => (
    <span key={i} style={{ animationDelay: `${i * 0.05}s` }} className={styles.letter}>
      {char}
    </span>
  ))}
  {username.split("").map((char, i) => (
    <span key={`u-${i}`} style={{ animationDelay: `${(i + 7) * 0.05}s` }} className={styles.letter}>
      {char}
    </span>
  ))}
  <span className={styles.letter} style={{ animationDelay: `${(username.length + 7) * 0.05}s` }}>!</span>
</h1>


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
                <button onClick={handleAddProduct} className={styles.profileButton}>
                    Dodaj ofertę
                </button>
                <button onClick={() => navigate('/user')} className={styles.profileButton}>
                    Mój profil
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
                            <p className={styles.productPrice}>Cena za 100ml: {product.price_per_100ml} PLN</p>
                            <p className={styles.productPrice}>Ilość krwi: {product.volume_ml} ml</p>
                            <p className={styles.productDescription}>Data dodania: {formatDate(product.created_at)}</p>


                            <button onClick={() => navigate(`/image/${product.id}`)} className={styles.imageButton}>
                                Zobacz zdjęcie
                            </button>

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
                        className={styles.pageButton}
                        style={{ backgroundColor: currentPage === index + 1 ? '#ff0000' : '#1a1a1a' }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            <div className={styles.legendBox}>
                <h2 className={styles.legendTitle}>Legenda BloodMarket</h2>
                <p className={styles.legendText}>
                    Dawno, dawno temu, kiedy Internet był jeszcze młody i pełen dzikich łąk HTML-a, powstała legenda o ukrytym targowisku — miejscu, gdzie puls życia płynął w kablach, a nie w żyłach.<br /><br />
                    Mówiono o BloodMarket — zakątku stworzonym dla tych, którzy wiedzą, że prawdziwe skarby nie świecą złotem, lecz kapie z nich ciepła czerwień.<br /><br />
                    Powtarzano szepty na forach, w linijkach kodu i zapomnianych IRC-ach:<br /><br />
                    <i>"Gdzie algorytm znajdzie twoją grupę krwi, tam twoja potrzeba zostanie zaspokojona."</i><br /><br />
                    BloodMarket nie ma adresu. BloodMarket jest w twojej sieci.<br />
                    Jeden klik, jedno hasło, jeden impuls.<br /><br />
                    Tu kupisz RH- szybciej niż pizzę i AB+ z dostawą dronem (gdybyśmy mieli drony).<br /><br />
                    Szukasz O+ dla ulubionego golemicznego rytuału? A może potrzebujesz B- na jutrzejszy cosplay nekromanty?<br /><br />
                    BloodMarket — bo nie wszystko da się kupić w aptece.<br /><br />
                    <b>Pamiętaj:</b><br />
                    <i>"Na BloodMarket nie przychodzisz z pustymi żyłami."</i><br /><br />
                    <small>(Uwaga: Wszelkie płyny dostępne na BloodMarket to certyfikowane mieszanki smakowe zgodne z lokalnymi przepisami prawa. Zakazane przez nudziarzy.)</small>
                </p>
            </div>
        </div>
    );
};

export default HomePage;
