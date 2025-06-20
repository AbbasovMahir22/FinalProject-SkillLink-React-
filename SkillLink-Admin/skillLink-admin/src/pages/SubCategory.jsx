import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../components/Spinner";
import AddSubCategoryModal from "../components/SubCategory/AddSubCategoryModal";
import EditSubCategoryModal from "../components/SubCategory/EditSubCategoryModal";
import "react-toastify/dist/ReactToastify.css";

const SubCategory = () => {
    const token = sessionStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const [subCategories, setSubCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [subCategoryToEdit, setSubCategoryToEdit] = useState(null);

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

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${apiUrl}/Admin/Category/GetAllCategoryForAdmin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data.$values || res.data);
        } catch {
            toast.error("Failed to fetch categories");
        }
    };

    const fetchSubCategories = async (reset = false) => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/Admin/SubCategory/GetSubCategoryForAdmin`, {
                params: {
                    pageNumber,
                    pageSize: 20,
                    search: searchTerm
                },
                headers: { Authorization: `Bearer ${token}` }
            });



            const fetchedData = res.data.$values || res.data;

            if (reset) {
                setSubCategories(fetchedData);
            } else {
                setSubCategories(prev => [...prev, ...fetchedData]);
            }

            setHasMore(fetchedData.length === 20);
        } catch {
            toast.error("Failed to fetch subcategories");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setPageNumber(1);
        setSubCategories([]);
        setHasMore(true);
    }, [searchTerm]);

    useEffect(() => {
        fetchSubCategories(pageNumber === 1);
    }, [pageNumber, searchTerm]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/SubCategory/Delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubCategories(prev => prev.filter(sc => sc.id !== id));
            toast.success("Deleted successfully");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Delete failed");
        }
    };

    const openCreateModal = () => setShowCreateModal(true);
    const closeCreateModal = () => setShowCreateModal(false);

    const openUpdateModal = (subCategory) => {
        setSubCategoryToEdit(subCategory);
        setShowUpdateModal(true);
    };
    const closeUpdateModal = () => {
        setSubCategoryToEdit(null);
        setShowUpdateModal(false);
    };

    const handleSubCategoryCreated = (newSubCategory) => {
        setSubCategories(prev => [newSubCategory, ...prev]);
    };

    const handleSubCategoryUpdated = (updatedSubCategory) => {
        setSubCategories(prev =>
            prev.map(sc => (sc.id === updatedSubCategory.id ? updatedSubCategory : sc))
        );
    };

    return (
        <div className="p-6 select-none relative">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">SubCategories</h1>
                <input
                    placeholder="Search"
                    className="rounded border p-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer mb-4 flex items-center gap-2"
                onClick={openCreateModal}
            >
                <FaPlus /> Add SubCategory
            </button>

            <div className="overflow-x-auto max-w-full">
                <table className="w-full table-fixed bg-white shadow-md rounded-lg overflow-hidden text-xs md:text-sm">
                    <thead className="bg-gray-100 whitespace-nowrap">
                        <tr>
                            <th className="px-2 md:px-6 py-2 md:py-3 text-left font-medium text-gray-700 min-w-[40px]">ID</th>
                            <th className="px-2 md:px-6 py-2 md:py-3 text-left font-medium text-gray-700 min-w-[100px]">Name</th>
                            <th className="px-2 md:px-6 py-2 md:py-3 text-left font-medium text-gray-700 min-w-[120px] hidden sm:table-cell">Category</th>
                            <th className="px-2 md:px-6 py-2 md:py-3 text-right font-medium text-gray-700 min-w-[80px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subCategories.map((sub, index) => {
                            const isLast = index === subCategories.length - 1;
                            return (
                                <tr
                                    key={sub.id}
                                    ref={isLast ? lastElementRef : null}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-2 md:px-6 py-2 md:py-4 min-w-0 break-words">{sub.id}</td>
                                    <td className="px-2 md:px-6 py-2 md:py-4 min-w-0 break-words max-w-[150px] md:max-w-none">{sub.name}</td>
                                    <td className="px-2 md:px-6 py-2 md:py-4 min-w-0 break-words max-w-[120px] hidden sm:table-cell">{sub.categoryName}</td>
                                    <td className="px-2 md:px-6 py-2 md:py-4 min-w-0 break-words flex justify-end gap-3">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            onClick={() => openUpdateModal(sub)}
                                            aria-label="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                            onClick={() => handleDelete(sub.id)}
                                            aria-label="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {loading && <Spinner />}
            </div>

            {showCreateModal && (
                <AddSubCategoryModal
                    categories={categories}
                    onClose={closeCreateModal}
                    onCreated={handleSubCategoryCreated}
                />
            )}

            {showUpdateModal && subCategoryToEdit && (
                <EditSubCategoryModal
                    subCategory={subCategoryToEdit}
                    categories={categories}
                    onClose={closeUpdateModal}
                    onUpdated={handleSubCategoryUpdated}
                />
            )}
        </div>
    );
};

export default SubCategory;
