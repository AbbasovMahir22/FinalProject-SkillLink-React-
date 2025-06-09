import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import AddCategoryModal from "../components/Category/AddCategoryModal";
import EditCategoryModal from "../components/Category/EditCategoryModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Category = () => {
    const token = localStorage.getItem("token");
    const [categories, setCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editCategoryName, setEditCategoryName] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchCategory, setSearchCategory] = useState("");
    const [filteredCategories, setFilteredCategories] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(`${apiUrl}/Admin/Category/GetAllCategoryForAdmin`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(response.data.$values);
                setFilteredCategories(response.data.$values);
            } catch (err) {
                alert("Failed to fetch categories.");
            }
        };
        getAllCategories();
    }, []);

    const search = () => {
        if (!searchCategory.trim()) {
            setFilteredCategories(categories);
            return;
        }
        const filtered = categories.filter(cat =>
            cat.name.toLowerCase().includes(searchCategory.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    useEffect(() => {
        search();
    }, [searchCategory, categories]);

    const handleAdd = () => {
        setNewCategoryName("");
        setShowAddModal(true);
    };

    const handleSaveCategory = async () => {
        if (!newCategoryName.trim()) return alert("Category name is required!");
        try {
            const response = await axios.post(
                `${apiUrl}/Admin/Category/Create`,
                { name: newCategoryName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCategories(prev => [...prev, response.data]);
            setShowAddModal(false);
            setNewCategoryName("");
        } catch (err) {

            toast.error(err.response.data.detail);
        }
    };

    const handleEdit = (id) => {
        const category = categories.find(cat => cat.id === id);
        if (category) {
            setEditingCategoryId(id);
            setEditCategoryName(category.name);
            setShowEditModal(true);
        }
    };

    const handleUpdateCategory = async () => {
        if (!editCategoryName.trim()) return alert("Category name is required!");
        try {
            setIsEditing(true);
            await axios.put(
                `${apiUrl}/Admin/Category/Update/${editingCategoryId}`,
                {
                    id: editingCategoryId,
                    name: editCategoryName,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCategories(prev =>
                prev.map(cat =>
                    cat.id === editingCategoryId ? { ...cat, name: editCategoryName } : cat
                )
            );
            setShowEditModal(false);
            setEditingCategoryId(null);
            setEditCategoryName("");
        } catch (err) {
            toast.error(err.response.data.detail);
        } finally {
            setIsEditing(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/Admin/Category/Delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(prev => prev.filter(cat => cat.id !== id));
        } catch (err) {
            toast.error(err.response.data.detail);
        }
    };

    return (
        <div className="p-6 select-none relative">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Categories</h1>
                <div className="flex items-center gap-5">
                    <input
                        placeholder="search"
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="max-w-[250px] min-w-[100px] rounded bg-white border outline-0 p-2"
                        type="text"
                        value={searchCategory}
                    />
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <FaPlus /> Add Category
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">ID</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Name</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">SubCategories</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Posts</th>
                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Created Date</th>
                            <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((cat) => (
                            <tr key={cat.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{cat.id}</td>
                                <td className="px-6 py-4">{cat.name}</td>
                                <td className="px-6 py-4">{cat.subCategoryCount}</td>
                                <td className="px-6 py-4">{cat.postCount}</td>
                                <td className="px-6 py-4">{new Date(cat.createdDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 flex justify-end gap-3">
                                    <button
                                        onClick={() => handleEdit(cat.id)}
                                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="text-red-500 cursor-pointer hover:text-red-700"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <AddCategoryModal
                    value={newCategoryName}
                    setValue={setNewCategoryName}
                    onSave={handleSaveCategory}
                    onClose={() => setShowAddModal(false)}
                />
            )}

            {showEditModal && (
                <EditCategoryModal
                    value={editCategoryName}
                    setValue={setEditCategoryName}
                    onSave={handleUpdateCategory}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditCategoryName("");
                        setEditingCategoryId(null);
                    }}
                    isLoading={isEditing}
                />
            )}
        </div>
    );
};

export default Category;
