import React, { useEffect, useState, useRef } from "react";
import Comment from "../components/Posts/Comment";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { IoArrowBackOutline } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";
import Loader from '../components/Loader';
import Swal from 'sweetalert2';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { getUserIdFromToken } from '../components/User/GetUserIdFromToken';
import { FaUserCircle } from "react-icons/fa";




const PostDetail = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const location = useLocation();
    const [data, setData] = useState({});
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [connection, setConnection] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [commentId, setCommentId] = useState();
    const [likeCount, setLikeCount] = useState();
    const commentScroll = useRef();

    useEffect(() => {
        const container = commentScroll.current;
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 300;
        if (isAtBottom) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [comments]);
    useEffect(() => {
        getPost();
    }, [id]);
    useEffect(() => {
        const token = localStorage.getItem("token");
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${apiUrl}/commenthub`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);
    function formatDescription(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        return text?.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                const url = new URL(part);
                const displayText = url.hostname.includes("chatgpt.com") ? "ChatGPT.com" : url.hostname.replace("www.", "");

                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        {displayText}
                    </a>
                );
            }
            return <span key={index}>{part}</span>;
        });
    }
    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    connection.invoke("AddToGroup", id);

                    connection.on("ReceiveComment", (newComment) => {
                        const myUserId = getUserIdFromToken();
                        const updatedComment = {
                            ...newComment,
                            isMine: newComment.userId === myUserId
                        };

                        setComments(prev => [...prev, updatedComment]);
                    });

                    connection.on("DeleteComment", (id) => {
                        setComments(prev => prev.filter(p => p.id != id));
                    })
                    connection.on("UpdateComment", (newComment) => {
                        setComments(prevComments =>
                            prevComments.map(comment =>
                                comment.id === newComment.id ? { ...comment, commentText: newComment.text } : comment
                            )
                        );
                        setNewText("");
                        setIsUpdate(false);
                    })
                })
                .catch(e => console.log("SignalR connection error: ", e));

            return () => {
                if (connection.state === "Connected") {
                    connection.invoke("RemoveFromGroup", id);
                    connection.stop();
                }
            };
        }
    }, [connection, id]);
    const getPost = async () => {

        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`apiUrl/Post/GetPostFullData/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
        setIsLiked(res.data.isLiked);
        setComments(res.data.commenters?.$values || []);
        setLoading(false);
        setLikeCount(res.data.likeCount);


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

        await axios.post(`${apiUrl}/Comment/Create`, newComment, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        setNewText("");

    };
    const handleEdit = (id, text) => {
        setCommentId(id);
        setNewText(text);
        setIsUpdate(true);
    }
    const cancelUpdate = () => {
        setIsUpdate(false);
        setNewText("");
    }
    const changedComment = {
        postId: id,
        newText: newText

    }
    const editComment = async () => {
        const token = localStorage.getItem("token");
        await axios.put(`${apiUrl}/Comment/Update/${commentId}`,
            changedComment,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
    }

    const handleDelete = async (commentId) => {

        setComments(prev => prev.filter(comment => comment.id !== commentId))
    }
    const likePost = async (id) => {
        const token = localStorage.getItem("token");
        if (isLiked) {
            await axios.delete(`${apiUrl}/Like/DeletePostLike/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setIsLiked(!isLiked);
            setLikeCount(prev => Math.max(0, prev - 1));
        }
        else {
            await axios.post(`${apiUrl}/Like/CreatePostLike/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setLikeCount(prev => Math.max(0, prev + 1));
            setIsLiked(!isLiked);
        }

    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
            {loading && <Loader />}


            <div className="flex-1 space-y-6 pr-2">
                <div className="flex items-center gap-4 border-b pb-2">
                    <Link to="/">
                        <IoArrowBackOutline className="w-[20px] h-[20px] cursor-pointer transition duration-300 hover:scale-110 hover:text-red-700" />
                    </Link>
                    {data.userImg ? (
                        <img
                            src={data.userImg}
                            alt="avatar"
                            className="w-12 h-12 rounded-full border object-cover"
                        />
                    ) : (
                        <FaUserCircle className="w-12 h-12 border shadow-sm rounded-full" />

                    )}
                    <div>
                        <Link to={`/userDetail/${data.userId}`}>
                            <h4 className="font-semibold cursor-pointer hover:text-amber-700 text-lg">{data.userName}</h4>
                        </Link>
                        <p className="text-sm text-gray-500">{data.createdDate}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 justify-between px-2">
                    <h2 className="text-2xl font-serif">{data.title}</h2>
                    <div className="flex items-center gap-2">
                        <p>{likeCount}</p>
                        <AiFillLike
                            onClick={() => likePost(data.id)}
                            className={`${isLiked ? "text-red-600" : "text-gray-500"} hover:text-red-700 cursor-pointer text-[25px]`}
                        />
                    </div>
                </div>

                {data.mediaUrl && (
                    <div className="w-full overflow-hidden rounded-lg shadow-md">
                        {data.isVideo ? (
                            <video controls className="w-full max-h-[500px] shadow-2xl" src={data.mediaUrl} />
                        ) : (
                            <img src={data.mediaUrl} alt="Post Media" className="w-full max-h-[450px] object-cover" />
                        )}
                    </div>
                )}

                <p className="text-black px-1 font-sans leading-relaxed break-words whitespace-pre-wrap">
                    {formatDescription(data.desc)}
                </p>
            </div>

            <div className="w-full lg:w-[400px] bg-blue-50 p-4 rounded-lg shadow-xl h-fit lg:sticky lg:top-24">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <h3 className="text-lg font-semibold text-blue-600">Comments</h3>
                    <span className="text-black font-semibold">({comments.length})</span>
                </div>

                <div ref={commentScroll} className="space-y-4 md:h-[280px] lg:h-[380px] max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div id={`comment-${comment.id}`} key={comment.id}>
                                <Comment comment={comment} commentDelete={handleDelete} handleEdit={handleEdit} />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 flex items-center text-sm italic">No comments yet.</p>
                    )}
                </div>

                <div id="input" className="pt-4 border-t mt-4">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="w-full px-3 py-2 border bg-white rounded text-sm mb-2"
                    />
                    {isUpdate ? (
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={editComment}
                                className="w-full py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={cancelUpdate}
                                className="w-full py-2 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={addComment}
                            className="w-full py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Add
                        </button>
                    )}
                </div>
            </div>

        </div>
    );

};

export default PostDetail;
