import { useState, useEffect } from "react";
import axios from "axios";
import Posts from "../components/Posts/Posts";
import { Link, Navigate } from "react-router-dom";
import Loader from '../components/Loader';



const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");


        setLoading(true);

        const getPost = async () => {
            try {
                const res = await axios.get("https://localhost:7067/api/Post/GetFollowingPosts", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPosts(res.data.$values);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false); // ✅
            }
        };

        getPost();


    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 "
        >
            {loading && <Loader />}{ }
            <Link to="/create">
                Create
            </Link>
            <Posts datas={posts} />
        </div>
    );
};

export default Home;
