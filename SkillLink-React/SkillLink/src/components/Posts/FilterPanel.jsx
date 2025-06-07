import { useEffect, useState } from "react";
import axios from "axios";

const FilterPanel = ({ onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [isVideo, setIsVideo] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    const token = localStorage.getItem("token");

    useEffect(() => {
        axios.get(`${apiUrl}/Category/GetAll`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setCategories(res.data.$values));
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            axios.get(`${apiUrl}/SubCategory/GetSubCategoriesByCategoryId/${selectedCategoryId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setSubCategories(res.data.$values));
        } else {
            setSubCategories([]);
            setSelectedSubCategoryId("");
        }
    }, [selectedCategoryId]);

    useEffect(() => {
        let parsedIsVideo = null;
        if (isVideo === "true") parsedIsVideo = true;
        else if (isVideo === "false") parsedIsVideo = false;
        onFilterChange({
            categoryId: selectedCategoryId,
            subCategoryId: selectedSubCategoryId,
            isVideo: parsedIsVideo
        });
    }, [selectedCategoryId, selectedSubCategoryId, isVideo]);

    return (
        <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-wrap gap-4 justify-center mb-6 mt-4">
            <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm md:text-base bg-white font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out hover:shadow"
            >
                <option value="">All Categories</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>

            <select
                value={selectedSubCategoryId}
                onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm md:text-base bg-white font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out hover:shadow"
                disabled={!subCategories.length}
            >
                <option value="">All Subcategories</option>
                {subCategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
            </select>

            <select
                value={isVideo}
                onChange={(e) => setIsVideo(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm md:text-base bg-white font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out hover:shadow"
            >
                <option value="">All Media</option>
                <option value="true">Only Videos</option>
                <option value="false">Only Images</option>
            </select>
        </div>
    );
};

export default FilterPanel;
