import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";



const RecentPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem("token");
    useEffect(() => {
        const getRecentPosts = async () => {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/AdminAccount/GetRecentPosts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setPosts(res.data.$values);
            setLoading(false);
        }
        getRecentPosts();
    }, [])
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-full">
            {loading ? <Spinner /> : ""}
            <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
            <ul>
                {posts.map((post) => (
                    <li
                        key={post.id}
                        className="border-b last:border-b-0 py-3 hover:bg-gray-50 cursor-pointer rounded-md transition"
                    >
                        <h4 className="font-semibold text-blue-600">{post.title}</h4>
                        <p className="text-sm text-gray-600">
                            Owner: <span className="font-medium">{post.fullName}</span> | Date:{" "}
                            {post.createdDate}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentPosts;
