import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Posts from "../components/Posts/Posts";
import { Link } from "react-router-dom";
import Loader from '../components/Loader';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const getPosts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://localhost:7067/api/Post/GetFollowingPosts", {
                params: { page, limit: 6 },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newPosts = response.data.$values;

            if (newPosts.length === 0) {
                setHasMore(false);
                setLoading(false);
            } else {
                setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    const handleScroll = () => {
        if (loading || !hasMore) return;

        const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
        const bottom = document.documentElement.offsetHeight;

        if (scrollPosition >= bottom - 100) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {loading && <Loader />}
            
            <Posts datas={posts} />

            {!hasMore && !loading && <div className="text-center py-4">No more posts available.</div>}
        </div>
    );
};

export default Home;
