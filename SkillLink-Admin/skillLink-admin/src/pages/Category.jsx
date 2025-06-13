import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import AddCategoryModal from "../components/Category/AddCategoryModal";
import EditCategoryModal from "../components/Category/EditCategoryModal";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../components/Spinner";
import "react-toastify/dist/ReactToastify.css";

const Category = () => {
    const token = sessionStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchCategory, setSearchCategory] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [editCategoryName, setEditCategoryName] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const fetchCategories = async (reset = false) => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/Admin/Category/GetAllCategoryForAdmin`, {
                params: {
                    pageNumber,
                    pageSize: 10,
                    search: searchCategory
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data.$values || res.data;
            setCategories(prev => reset ? data : [...prev, ...data]);
            setHasMore(data.length === res.config.params.pageSize);
        } catch {
            toast.error("Failed to fetch categories");
        }
        setLoading(false);
    };

    useEffect(() => {
        setPageNumber(1);
        setCategories([]);
        setHasMore(true);
    }, [searchCategory]);

    useEffect(() => {
        fetchCategories(pageNumber === 1);
    }, [pageNumber, searchCategory]);

    const handleAdd = () => {
        setNewCategoryName("");
        setShowAddModal(true);
    };
    const handleSaveCategory = async () => {
        if (!newCategoryName.trim()) return toast.error("Category name is required!");
        try {
            const res = await axios.post(
                `${apiUrl}/Admin/Category/Create`,
                { name: newCategoryName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCategories(prev => [res.data, ...prev]);
            setShowAddModal(false);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Add failed");
        }
    };

    const handleEdit = id => {
        const cat = categories.find(c => c.id === id);
        if (!cat) return;
        setEditingCategoryId(id);
        setEditCategoryName(cat.name);
        setShowEditModal(true);
    };
    const handleUpdateCategory = async () => {
        if (!editCategoryName.trim()) return toast.error("Category name is required!");
        try {
            setIsEditing(true);
            await axios.put(
                `${apiUrl}/Admin/Category/Update/${editingCategoryId}`,
                { id: editingCategoryId, name: editCategoryName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCategories(prev => prev.map(c =>
                c.id === editingCategoryId ? { ...c, name: editCategoryName } : c
            ));
            setShowEditModal(false);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Update failed");
        } finally {
            setIsEditing(false);
        }
    };

    const handleDelete = async id => {
        try {
            await axios.delete(`${apiUrl}/Admin/Category/Delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            toast.error(err.response?.data?.detail || "Delete failed");
        }
    };

    return (
        <div className="p-6 select-none relative">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Categories</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="rounded border p-2"
                        value={searchCategory}
                        onChange={e => setSearchCategory(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleAdd}
                    >
                        <FaPlus /> Add
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto max-w-full">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">SubCategories</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Posts</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                            <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, idx) => {
                            const isLast = idx === categories.length - 1;
                            return (
                                <tr
                                    key={cat.id}
                                    ref={isLast ? lastElementRef : null}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">{cat.id}</td>
                                    <td className="px-6 py-4">{cat.name}</td>
                                    <td className="px-6 py-4">{cat.subCategoryCount}</td>
                                    <td className="px-6 py-4">{cat.postCount}</td>
                                    <td className="px-6 py-4">{cat.createdDate}</td>
                                    <td className="px-6 py-4 flex justify-end gap-3">
                                        <FaEdit
                                            className="cursor-pointer text-blue-500 hover:text-blue-700"
                                            onClick={() => handleEdit(cat.id)}
                                        />
                                        <FaTrash
                                            className="cursor-pointer text-red-500 hover:text-red-700"
                                            onClick={() => handleDelete(cat.id)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {loading && <Spinner />}
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
                    onClose={() => setShowEditModal(false)}
                    isLoading={isEditing}
                />
            )}
        </div>
    );
};

export default Category;
