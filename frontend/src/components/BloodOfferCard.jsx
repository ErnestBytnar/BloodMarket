// components/BloodOfferCard.jsx
const BloodOfferCard = ({ offer, onBuy }) => {
    return (
        <div className="blood-offer-card">
            <h3>Blood Type: {offer.blood_type.name}</h3>
            <p>Volume: {offer.volume_ml} ml</p>
            <p>Price: ${offer.total_price}</p>
            <p>Location: {offer.location}</p>
            <p>Seller: {offer.seller.username}</p>
            <p>Expires: {new Date(offer.expires_at).toLocaleDateString()}</p>

            {offer.available && (
                <button onClick={onBuy}>Buy Now</button>
            )}
        </div>
    );
};

export default BloodOfferCard;