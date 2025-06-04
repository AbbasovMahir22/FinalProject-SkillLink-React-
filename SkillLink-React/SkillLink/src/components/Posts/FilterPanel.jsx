import { useEffect, useState } from "react";
import axios from "axios";

const FilterPanel = ({ onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [isVideo, setIsVideo] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        axios.get("https://localhost:7067/api/Category/GetAll", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setCategories(res.data.$values));
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            axios.get(`https://localhost:7067/api/SubCategory/GetSubCategoriesByCategoryId/${selectedCategoryId}`, {
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
        <div className="flex gap-4 flex-wrap mb-6 mt-2 justify-center">
            <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="border cursor-pointer p-1 rounded-lg sm:text-[10px] md:text-[15px] bg-white font-bold"
            >
                <option  value="">All Categories</option>
                {categories.map(cat => (
                    <option  key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>

            <select
                value={selectedSubCategoryId}
                onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                className="border p-1 cursor-pointer rounded-lg sm:text-[10px] md:text-[15px] bg-white font-bold max-h-40"
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
                className="border cursor-pointer p-1 sm:text-[10px] md:text-[15px] rounded-lg bg-white font-bold"
            >
                <option value="">All Media</option>
                <option value="true">Only Videos</option>
                <option value="false">Only Images</option>
            </select>
        </div>
    );
};

export default FilterPanel;
