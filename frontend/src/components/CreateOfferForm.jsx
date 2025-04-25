// components/CreateOfferForm.jsx
import { useState } from "react";
import { createBloodOffer } from "../api/bloodMarket";

const CreateOfferForm = () => {
    const [formData, setFormData] = useState({
        blood_type: '',
        volume_ml: '',
        total_price: '',
        location: '',
        expires_at: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBloodOffer(formData);
            setSuccess(true);
            setError(null);
        } catch (err) {
            setError(err.message);
            setSuccess(false);
        }
    };

    return (
        <div className="create-offer-form">
            <h2>Create New Blood Offer</h2>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">Offer created successfully!</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Blood Type ID:</label>
                    <input
                        type="text"
                        name="blood_type"
                        value={formData.blood_type}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Volume (ml):</label>
                    <input
                        type="number"
                        name="volume_ml"
                        value={formData.volume_ml}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Total Price:</label>
                    <input
                        type="number"
                        name="total_price"
                        value={formData.total_price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Expires At:</label>
                    <input
                        type="date"
                        name="expires_at"
                        value={formData.expires_at}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Create Offer</button>
            </form>
        </div>
    );
};

export default CreateOfferForm;