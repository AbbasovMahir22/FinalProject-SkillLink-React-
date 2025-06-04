import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';

const PostCreateForm = ({ closeModal }) => {
    const { register, handleSubmit, watch, reset } = useForm();
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    const selectedCategoryId = watch('categoryId');
    const token = localStorage.getItem("token");
    useEffect(() => {
        debugger
        axios.get('https://localhost:7067/api/Category/GetAll', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }

        )
            .then(res => setCategories(res.data.$values));
    }, []);

    useEffect(() => {
        debugger
        if (selectedCategoryId) {
            axios.get(`https://localhost:7067/api/SubCategory/GetSubCategoriesByCategoryId/${selectedCategoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => setSubCategories(res.data.$values));
        } else {
            setSubCategories([]);
        }
    }, [selectedCategoryId]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        console.log("Form data: ", data);
        console.log(data.mediaUrl[0].type);
        formData.append("categoryId", data.categoryId);
        formData.append("subCategoryId", data.subCategoryId);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("mediaUrl", data.mediaUrl[0]);

        setLoading(true);
        try {
            await axios.post('https://localhost:7067/api/Post/Create', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            Swal.fire({
                title: "Success!",
                text: "Created successfully.",
                icon: "success",

            });
            closeModal();
            reset();
        } catch (err) {

            setError(err.response.data.detail);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <form
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
                className="w-full max-w-md bg-white px-6 py-2 rounded-2xl shadow-xl space-y-5"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Create New Post</h2>

                <div>
                    <label className="block font-medium text-gray-700">Category</label>
                    <select {...register("categoryId")} required
                        className="w-full border border-gray-300 p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Choose</option>
                        {categories.map(cat => (
                            <option className='cursor-pointer' key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block  font-medium text-gray-700">SubCategory</label>
                    <select {...register("subCategoryId")}
                        className="w-full border border-gray-300 p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Choose</option>
                        {subCategories.map(sub => (
                            <option className='cursor-pointer' key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block  font-medium text-gray-700">Title</label>
                    <input type="text" {...register("title")} required
                        className="w-full border border-gray-300 p-2 rounded-lg cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Description</label>
                    <textarea {...register("description")} required rows="4"
                        className="w-full border border-gray-300 p-2 rounded-lg cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Photo or Video</label>
                    <input type="file" {...register("mediaUrl")} accept="image/*,video/*" required
                        className="w-full border border-gray-300 p-2 rounded-lg bg-white file:mr-4 file:py-2 file:px-4
                                   file:rounded-lg file:border-0 file:text-sm file:font-semibold
                                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    <div className='text-red-500 '>{error}</div>
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? <ClipLoader size={20} color="#fff" /> : 'Create Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostCreateForm;
