import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from '../components/Posts/PostCard';

const LikedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 8;

    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchPosts = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/Post/GetLikedPosts?page=${page}&pageSize=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newPosts = response.data?.$values || response.data || [];

            setPosts((prev) => [...prev, ...newPosts]);

            if (newPosts.length < pageSize) {
                setHasMore(false);
            } else {
                setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Postları yükləməkdə problem oldu:", error);
            setHasMore(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
                You Liked Posts
            </h1>

            <InfiniteScroll
                dataLength={posts.length}
                next={fetchPosts}
                hasMore={hasMore}
                loader={
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        Loading...
                    </p>
                }
                endMessage={
                    <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                        no more post.
                    </p>
                }
            >
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default LikedPosts;
