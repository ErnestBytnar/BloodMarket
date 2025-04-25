// src/pages/BloodOffersPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBloodOffers, getSortedOffers, getBloodTypes } from "../api/bloodMarket";
import BloodOfferCard from "../components/BloodOfferCard";
import BloodTypeFilter from "../components/BloodTypeFilter";
import SortControls from "../components/SortControls";

const BloodOffersPage = () => {
    const [offers, setOffers] = useState([]);
    const [bloodTypes, setBloodTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [offersData, typesData] = await Promise.all([
                    getBloodOffers(filters),
                    getBloodTypes()
                ]);
                setOffers(offersData);
                setBloodTypes(typesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters]);

    const handleSort = async (sortBy, order) => {
        try {
            setLoading(true);
            const sortedOffers = await getSortedOffers(sortBy, order);
            setOffers(sortedOffers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Ładowanie ofert...</div>;
    if (error) return <div>Błąd: {error}</div>;

    return (
        <div className="blood-offers-page">
            <h1>Oferty krwi</h1>

            <div className="controls">
                <BloodTypeFilter
                    bloodTypes={bloodTypes}
                    onFilterChange={(typeId) => setFilters({...filters, blood_type: typeId})}
                />

                <SortControls onSort={handleSort} />

                <button onClick={() => navigate('/create-offer')}>
                    Stwórz nową ofertę
                </button>
            </div>

            <div className="offers-grid">
                {offers.map(offer => (
                    <BloodOfferCard
                        key={offer.id}
                        offer={offer}
                        onBuy={() => navigate(`/make-transaction/${offer.id}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BloodOffersPage;