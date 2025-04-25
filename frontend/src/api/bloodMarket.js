// api/bloodMarket.js
const API_URL = process.env.REACT_APP_API_URL;

export const getBloodOffers = async (filters = {}) => {
    const token = localStorage.getItem("access_token");
    const queryParams = new URLSearchParams(filters).toString();

    const response = await fetch(`${API_URL}/get_offers/?${queryParams}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error("Failed to fetch blood offers");
    return await response.json();
};

export const getSortedOffers = async (sortBy = 'id', order = 'asc') => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/get_sorted_offers/?sort_by=${sortBy}&order=${order}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error("Failed to fetch sorted offers");
    return await response.json();
};

export const getBloodTransactions = async () => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/get_transactions/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error("Failed to fetch transactions");
    return await response.json();
};

export const createBloodOffer = async (offerData) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/create_offer/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(offerData)
    });

    if (!response.ok) throw new Error("Failed to create offer");
    return await response.json();
};

export const makeTransaction = async (transactionData) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/make_transaction/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transactionData)
    });

    if (!response.ok) throw new Error("Failed to make transaction");
    return await response.json();
};

export const getBloodTypes = async () => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/show_blood_types/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error("Failed to fetch blood types");
    return await response.json();
};
// src/api/bloodMarket.js
export const getBloodOffer = async (offerId) => {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_URL}/get_offers/${offerId}/`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error("Nie udało się pobrać oferty");
    return await response.json();
};