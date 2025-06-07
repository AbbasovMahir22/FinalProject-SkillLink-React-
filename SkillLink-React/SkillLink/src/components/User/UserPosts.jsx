import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../Posts/PostCard";
import Loader from '../Loader';

const UserPosts = ({ userId, filters }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchPosts = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await axios.get(`${apiUrl}/Post/GetAll/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    categoryId: filters.categoryId || undefined,
                    subCategoryId: filters.subCategoryId || undefined,
                    isVideo: filters.isVideo === "" ? undefined : filters.isVideo,
                    pageNumber,
                    pageCount,
                }
            });

            setPosts(res.data.posts.$values || []);
            const totalCount = res.data.totalCount;
            setTotalPages(Math.ceil(totalCount / pageCount));
        } catch (error) {
            console.error("Get Post:", error);
        }

        setLoading(false);
    };

    useEffect(() => {
        setPageNumber(1);
    }, [filters]);

    useEffect(() => {
        fetchPosts();
    }, [userId, filters, pageNumber]);

    return (
        <>
            {loading && <Loader />}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {!loading && posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>


            {!loading && totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    <button
                        disabled={pageNumber === 1}
                        onClick={() => setPageNumber(prev => prev - 1)}
                        className="px-4 py-2 cursor-pointer bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 sm:text-[12px] md:text-[20px]  bg-white border rounded">
                        Page {pageNumber} of {totalPages}
                    </span>
                    <button
                        disabled={pageNumber === totalPages}
                        onClick={() => setPageNumber(prev => prev + 1)}
                        className="sm:px-1 md:px-4 py-2 cursor-pointer bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
};

export default UserPosts;
