import React, { useState, useEffect, useCallback } from "react";

const SortControls = ({ onSort }) => {
    const [sortBy, setSortBy] = useState('id');
    const [order, setOrder] = useState('asc');

    const handleSort = useCallback(() => {
        onSort(sortBy, order);
    }, [onSort, sortBy, order]);

    useEffect(() => {
        handleSort();
    }, [handleSort]);

    return (
        <div className="sort-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="id">ID</option>
                <option value="total_price">Price</option>
                <option value="volume_ml">Volume</option>
                <option value="created_at">Date</option>
            </select>

            <select value={order} onChange={(e) => setOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
    );
};

export default SortControls;