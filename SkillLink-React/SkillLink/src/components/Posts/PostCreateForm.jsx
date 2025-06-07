import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const PostCreateForm = ({ closeModal }) => {
    const { register, handleSubmit, watch, reset } = useForm();
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const selectedCategoryId = watch('categoryId');
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`${apiUrl}/Category/GetAll`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(res => setCategories(res.data.$values));
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            axios.get(`${apiUrl}/SubCategory/GetSubCategoriesByCategoryId/${selectedCategoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then(res => setSubCategories(res.data.$values));
        } else {
            setSubCategories([]);
        }
    }, [selectedCategoryId]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("categoryId", data.categoryId);
        formData.append("subCategoryId", data.subCategoryId);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("mediaUrl", data.mediaUrl[0]);

        setLoading(true);
        try {
            await axios.post(`${apiUrl}/Post/Create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire({
                title: "Success!",
                text: "Post created successfully.",
                icon: "success",
            });
            window.location.reload();
            closeModal();
            reset();
            navigate("/MyProfile");
        } catch (err) {
            setError(err.response?.data?.detail || "Something went wrong.");
            Swal.fire({
                title: "Error!",
                text: error,
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100/30 backdrop-blur-sm p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white/70 rounded-2xl shadow-xl px-6 py-8 space-y-6"
                encType="multipart/form-data"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800">Create New Post</h2>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Category</label>
                    <select
                        {...register("categoryId")}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">Choose a category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1">SubCategory</label>
                    <select
                        {...register("subCategoryId")}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">Choose a subcategory</option>
                        {subCategories.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Title</label>
                    <input
                        type="text"
                        {...register("title")}
                        required
                        placeholder="Post title..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Description</label>
                    <textarea
                        {...register("description")}
                        required
                        rows={4}
                        placeholder="Write something..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Photo or Video</label>
                    <input
                        type="file"
                        {...register("mediaUrl")}
                        accept="image/*,video/*"
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white file:mr-4 file:py-2 file:px-4
                               file:rounded-lg file:border-0 file:text-sm file:font-semibold
                               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-300 disabled:opacity-50"
                    >
                        {loading ? <ClipLoader size={20} color="#fff" /> : "Create Post"}
                    </button>
                </div>
            </form>
        </div>
    );

};

export default PostCreateForm;
