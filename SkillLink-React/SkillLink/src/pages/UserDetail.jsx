import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from '../components/Loader';

const UserDetail = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);
        // const getUser = async () => {
        //     try {
        //         const res = await axios.get(`https://localhost:7067/api/Account/GetByUser/${id}`);
        //         setUser(res.data);
        //         setPosts(res.data.posts || []);
        //         setComments(res.data.comments || []);
                    setLoading(false);
        //     } catch (error) {
        //         console.error("User loading failed", error);
        //     }
        // };

        // getUser();
    }, [userId]);

    if (!user) {
        return (
            <div className="text-center py-10 text-gray-600">
                İstifadəçi məlumatları yüklənir...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
            {loading && <Loader />}{ }
            <div className="bg-white rounded-lg shadow flex flex-col sm:flex-row items-center gap-6 p-6 mb-8">
                <img
                    src={user.imageUrl}
                    alt={user.fullName}
                    className="w-28 h-28 rounded-full object-cover border"
                />
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <div className="mt-4">
                        <h3 className="text-md font-semibold mb-1">Şərhlər</h3>
                        <ul className="text-sm text-gray-700 space-y-1 max-h-32 overflow-y-auto">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <li key={comment.id} className="bg-gray-100 p-2 rounded">
                                        {comment.message}
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-400 italic">Şərh yoxdur</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Paylaşılan Postlar</h3>
                {posts.length === 0 ? (
                    <p className="text-gray-500">İstifadəçi hələ post paylaşmayıb.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {posts.map((post) => {
                            const isVideo = post.image.endsWith(".mp4");
                            return (
                                <div key={post.id} className="bg-white rounded shadow p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{post.title}</h4>
                                    {isVideo ? (
                                        <video controls className="w-full h-48 rounded object-cover">
                                            <source src={post.image} type="video/mp4" />
                                            Sizin brauzer videonu dəstəkləmir.
                                        </video>
                                    ) : (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-48 rounded object-cover"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetail;
