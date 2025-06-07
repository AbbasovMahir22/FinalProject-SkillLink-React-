import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Posts from "../components/Posts/Posts";
import { Link, useNavigate } from "react-router-dom";
import Loader from '../components/Loader';
import NoPostsPrompt from "../components/Posts/NoPostsPrompt";
import SuggestedUsers from '../components/User/SuggestedUsers';
const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const [showPrompt, setShowPrompt] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    const getPosts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiUrl}/Post/GetFollowingPosts`, {
                params: { page, limit: 6 },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newPosts = response.data.$values;

            if (newPosts.length === 0) {
                console.log("No posts, showing prompt...");
                setShowPrompt(true);
                setHasMore(false);
                setLoading(false);
                return;
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

        if (scrollPosition >= bottom - 50) {
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
            <NoPostsPrompt
                open={showPrompt}
                onClose={() => setShowPrompt(false)}
                onConfirm={() => navigate("/explore")}
            />
            <SuggestedUsers />
            {!hasMore && !loading && <div className="text-center py-4">No more posts available.</div>}
        </div>
    );
};

export default Home;
