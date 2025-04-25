// pages/MakeTransactionPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { makeTransaction, getBloodOffer } from "../api/bloodMarket";

const MakeTransactionPage = () => {
    const { offerId } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const offerData = await getBloodOffer(offerId);
                setOffer(offerData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOffer();
    }, [offerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await makeTransaction({
                offer: offerId,
                buyer_note: "Transaction completed"
            });
            setSuccess(true);
            setError(null);
            setTimeout(() => navigate('/offers'), 2000);
        } catch (err) {
            setError(err.message);
            setSuccess(false);
        }
    };

    if (loading) return <div>Loading offer details...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!offer) return <div>Offer not found</div>;

    return (
        <div className="transaction-page">
            <h1>Complete Transaction</h1>

            <div className="offer-details">
                <h3>{offer.blood_type.name} Blood</h3>
                <p>Volume: {offer.volume_ml} ml</p>
                <p>Price: ${offer.total_price}</p>
                <p>Seller: {offer.seller.username}</p>
            </div>

            {success ? (
                <div className="success">Transaction completed successfully!</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <button type="submit">Confirm Purchase</button>
                </form>
            )}
        </div>
    );
};

export default MakeTransactionPage;