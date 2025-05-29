import React, { useEffect, useState } from "react";
import Comment from "../components/Posts/Comment";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { IoArrowBackOutline } from "react-icons/io5";
import Loader from '../components/Loader';
import Swal from 'sweetalert2';


const PostDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [data, setData] = useState({});
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getPost();
    }, [id]);

    const getPost = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://localhost:7067/api/Post/GetPostFullData/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        setComments(res.data.commenters?.$values || []);
        setLoading(false);
    };

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            const element = document.getElementById(id);
            setTimeout(() => {
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "end" });
                }
            }, 300);
        }
    }, [comments, location]);

    const [newText, setNewText] = useState("");

    const addComment = async () => {
        const token = localStorage.getItem("token");

        if (!newText.trim()) {
            Swal.fire({
                title: "error!",
                text: "cannot be empty",
                icon: "error",

            });
            return;
        }

        const newComment = {
            postId: id,
            text: newText
        };

        try {
            const res = await axios.post("https://localhost:7067/api/Comment/Create", newComment, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            setNewText("");
            setComments(prev => [...prev, res.data]);
        } catch (error) {
            console.error("Error creating comment:", error.response?.data || error.message);
        }
    };
    const handleDelete = async (commentId) => {
        console.log(commentId);

        setComments(prev => prev.filter(comment => comment.id !== commentId))
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
            {loading && <Loader />}
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4 border-b pb-2">
                    <Link to="/">
                        <IoArrowBackOutline className="w-[20px] h-[20px] cursor-pointer transition duration-300 hover:scale-110 hover:text-red-700" />
                    </Link>
                    <img
                        src={data.userImg}
                        alt="avatar"
                        className="w-12 h-12 rounded-full border object-cover"
                    />
                    <div>
                        <Link to={`/userDetail/${data.userId}`}>
                            <h4 className="font-semibold cursor-pointer hover:text-amber-700 text-lg">{data.userName}</h4>
                        </Link>
                        <p className="text-sm text-gray-500">{data.createdDate}</p>
                    </div>
                </div>

                <h2 className="text-2xl">{data.title}</h2>

                {data.mediaUrl && (
                    <div className="w-full overflow-hidden rounded-lg shadow-md">
                        {data.isVideo ? (
                            <video
                                controls
                                className="w-full max-h-[500px] object-cover"
                                src={data.mediaUrl}
                            />
                        ) : (
                            <img
                                src={data.mediaUrl}
                                alt="Post Media"
                                className="w-full max-h-[450px] object-cover"
                            />
                        )}
                    </div>
                )}

                <p className="text-gray-700 leading-relaxed">{data.desc}</p>
            </div>

            <div className="w-full lg:w-[400px] bg-yellow-50 p-4 rounded-lg shadow-xl h-fit">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <h3 className="text-lg font-semibold text-blue-600">Comments</h3>
                    <span className="text-black font-semibold">{comments.length}</span>
                </div>

                <div className="space-y-4 md:h-[280px] lg:h-[380px] max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div id={`comment-${comment.id}`} key={comment.id} >
                                <Comment comment={comment} commentDelete={handleDelete} />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 flex items-center text-sm italic">No comments yet.</p>
                    )}


                </div>

                <div className="pt-4 border-t mt-4">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="w-full px-3 py-2 border bg-white rounded text-sm mb-2"
                    />
                    <button
                        onClick={addComment}
                        className="w-full py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
