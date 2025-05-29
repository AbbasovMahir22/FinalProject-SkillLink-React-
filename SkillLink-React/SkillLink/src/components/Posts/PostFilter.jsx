import React, { useState } from 'react';

const PostFilter = () => {
    const [category, setCategory] = useState('');

    const handleChange = (e) => {
        const selected = e.target.value;
        setCategory(selected);
        onFilterChange(selected);
    };

    return (
        <div className="bg-white shadow-lg rounded-md p-3 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4  border-b-2">
            <label className="text-gray-600 font-medium">Kateqoriya seç:</label>
            <select
                value={category}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <option value="">All</option>
                <option value="nature">Nature</option>
                <option value="city">City</option>
                <option value="art">Cosmic</option>
                <option value="technology">Tecno</option>
            </select>
        </div>
    );
};

export default PostFilter;