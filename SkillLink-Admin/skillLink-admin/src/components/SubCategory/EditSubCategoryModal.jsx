import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const EditSubCategoryModal = ({ subCategory, categories, onClose, onUpdated }) => {
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const token = sessionStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (subCategory) {
            setName(subCategory.name);
            setCategoryId(subCategory.categoryId);
        }
    }, [subCategory]);

    const handleUpdate = async () => {
        if (!name.trim() || !categoryId) {
            return toast.error("Name and category are required");
        }

        try {
            const res = await axios.put(
                `${apiUrl}/SubCategory/Update/${subCategory.id}`,
                {
                    id: subCategory.id,
                    categoryId,
                    name

                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("SubCategory updated successfully");
            onUpdated(res.data);
            console.log(res.data);
            
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Update failed");
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-xs  flex justify-center items-center z-50">
            <div className="bg-yellow-100 p-6 rounded-lg w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl cursor-pointer"
                >
                    <FaTimes />
                </button>
                <h2 className="text-2xl font-semibold mb-4">Update SubCategory</h2>
                <input
                    type="text"
                    placeholder="SubCategory Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-3 border p-2 rounded"
                />
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full mb-4 border p-2 rounded"
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full cursor-pointer"
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default EditSubCategoryModal;
