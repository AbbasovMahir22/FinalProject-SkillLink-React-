import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const EditPostModal = ({ isOpen, onClose, post, onSave }) => {
    const [title, setTitle] = useState(post?.title || "");
    const [desc, setDesc] = useState(post?.desc || "");
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(post?.categoryId || "");
    const [subCategories, setSubCategories] = useState([]);
    const [subCategoryId, setSubCategoryId] = useState(post?.subCategoryId || "");
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(post?.mediaUrl || "");
    const [isVideo, setIsVideo] = useState(post?.isVideo || false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        setTitle(post?.title || "");
        setDesc(post?.desc || "");
        setCategoryId(post?.categoryId || "");
        setSubCategoryId(post?.subCategoryId || "");
        setMediaPreview(post?.mediaUrl || "");
        setIsVideo(post?.isVideo || false);
        setMediaFile(null);
    }, [post]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchCategories = async () => {
            try {
                const response = await axios.get("https://localhost:7067/api/Category/GetAll", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCategories(response.data.$values);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, [isOpen]);

    useEffect(() => {
        if (!categoryId) {
            setSubCategories([]);
            setSubCategoryId("");
            return;
        }

        const fetchSubCategories = async () => {
            try {
                const response = await axios.get(`https://localhost:7067/api/SubCategory/GetSubCategoriesByCategoryId/${categoryId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSubCategories(response.data.$values);
                setSubCategoryId("");
            } catch (error) {
                console.error("Failed to fetch subcategories:", error);
                setSubCategories([]);
            }
        };

        fetchSubCategories();
    }, [categoryId]);

    if (!isOpen) return null;

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
            setIsVideo(file.type.startsWith("video/"));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", desc);
        formData.append("categoryId", categoryId);
        formData.append("subCategoryId", subCategoryId);
        formData.append("isVideo", isVideo);

        if (mediaFile) {
            formData.append("newMediaUrl", mediaFile);
        }

        onSave(formData);
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs flex justify-center items-center z-50">
            <div className="bg-blue-50 font-bold rounded-lg p-6 w-full max-w-md relative shadow-lg max-h-[90vh] overflow-auto">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 cursor-pointer text-gray-600 hover:text-gray-900 text-2xl font-bold"
                    aria-label="Close modal"
                >
                    &times;
                </button>

                <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label>
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                            required
                        />
                    </label>

                    <label>
                        Description:
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                            required
                        />
                    </label>

                    <label>
                        Category:
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        >
                            <option value="" disabled>
                                Select category
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Sub Category:
                        <select
                            value={subCategoryId}
                            onChange={(e) => setSubCategoryId(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                            disabled={!subCategories.length}
                        >
                            <option value="" disabled>
                                {subCategories.length ? "Select sub category" : "Select category first"}
                            </option>
                            {subCategories.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Media (image or video):
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleMediaChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                        />
                    </label>

                    {mediaPreview &&
                        (isVideo ? (
                            <video src={mediaPreview} controls className="w-full h-40 object-cover rounded" />
                        ) : (
                            <img src={mediaPreview} alt="Media preview" className="w-full h-40 object-cover rounded" />
                        ))}

                    <button
                        type="submit"
                        className="bg-blue-600 cursor-pointer text-white rounded px-4 py-2 hover:bg-blue-700 transition"
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default EditPostModal;
