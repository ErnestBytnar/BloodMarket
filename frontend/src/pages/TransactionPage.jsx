// pages/TransactionsPage.jsx
import { useState, useEffect } from "react";
import { getBloodTransactions } from "../api/bloodMarket";

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const transactionsData = await getBloodTransactions();
                setTransactions(transactionsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) return <div>Loading transactions...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="transactions-page">
            <h1>Your Transactions</h1>

            <div className="transactions-list">
                {transactions.map(transaction => (
                    <div key={transaction.id} className="transaction-card">
                        <h3>Transaction #{transaction.id}</h3>
                        <p>Offer: {transaction.offer.blood_type.name} - {transaction.offer.volume_ml}ml</p>
                        <p>Price: ${transaction.offer.total_price}</p>
                        <p>Seller: {transaction.offer.seller.username}</p>
                        <p>Date: {new Date(transaction.created_at).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionsPage;