import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AddSubCategoryModal = ({ onClose, onCreated, categories }) => {
    const token = sessionStorage.getItem("token");
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleCreate = async () => {
        if (!name.trim() || !categoryId) {
            return toast.error("Name and category are required");
        }

        try {
            const res = await axios.post(
                `${apiUrl}/SubCategory/Create`,
                { name, categoryId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const matchedCategory = categories.find(cat => cat.id === categoryId);
            const categoryName = matchedCategory?.name || "";

            const createdSubCategory = {
                ...res.data,
                categoryName,
            };

            onCreated(createdSubCategory);
            onClose();
            toast.success("SubCategory created successfully");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Error creating subcategory");
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Create SubCategory</h2>

                <input
                    className="border p-2 rounded w-full mb-3"
                    placeholder="SubCategory Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <select
                    className="border p-2 rounded w-full mb-4"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <div className="flex justify-end gap-3">
                    <button
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleCreate}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSubCategoryModal;
