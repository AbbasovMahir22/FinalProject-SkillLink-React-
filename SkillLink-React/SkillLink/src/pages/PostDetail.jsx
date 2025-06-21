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
import { ToastContainer, toast } from "react-toastify";
import { MdWarning } from "react-icons/md";
import ReportModal from "../components/Posts/ReportModal";

const PostDetail = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const location = useLocation();

    const [data, setData] = useState({});
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [connection, setConnection] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [commentId, setCommentId] = useState();
    const [likeCount, setLikeCount] = useState();
    const [reportLoading, setReportLoading] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [newText, setNewText] = useState("");

    const commentScroll = useRef();

    const formatDescription = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text?.split(urlRegex).map((part, index) => (
            part.match(urlRegex) ? (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    {new URL(part).hostname.replace("www.", "")}
                </a>
            ) : (
                <span key={index}>{part}</span>
            )
        ));
    };

    const fetchPost = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/Post/GetPostFullData/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
            setIsLiked(res.data.isLiked);
            setComments(res.data.commenters?.$values || []);
            setLikeCount(res.data.likeCount);
        } catch (err) {
            Swal.fire({
                title: "Sorry",
                text: err.response?.data?.detail || "Something went wrong",
                icon: "error",
            }).then(() => window.history.back());
        } finally {
            setLoading(false);
        }
    };

    const setupSignalR = () => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${apiUrl}/commenthub`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    useEffect(() => {
        setupSignalR();
    }, []);

    useEffect(() => {
        if (!connection || !data.userId) return;

        connection.start()
            .then(() => {
                connection.invoke("AddToGroup", id);

                connection.on("ReceiveComment", (newComment) => {
                    const myUserId = getUserIdFromToken();
                    setComments(prev => prev.some(c => c.id === newComment.id) ? prev : [...prev, {
                        ...newComment,
                        isMine: newComment.userId === myUserId,
                        isPostOwner: data.userId === myUserId,
                    }]);
                });

                connection.on("HiddenOrUnHidden", ({ commentId, isHidden, userId }) => {
                    setComments(prev =>
                        prev.map(c =>
                            c.id === commentId
                                ? { ...c, isHidden }
                                : c
                        )
                    );
                });

                connection.on("DeleteComment", (commentId) => {
                    setComments(prev => prev.filter(p => p.id !== commentId));
                });

                connection.on("UpdateComment", ({ id, text }) => {
                    setComments(prev => prev.map(c => c.id === id ? { ...c, commentText: text } : c));
                    setNewText("");
                    setIsUpdate(false);
                });
            })
            .catch(e => console.error("SignalR connection error:", e));

        return () => {
            connection?.invoke("RemoveFromGroup", id);
            connection?.off("ReceiveComment");
            connection?.off("HiddenOrUnHidden");
            connection?.off("DeleteComment");
            connection?.off("UpdateComment");
            connection?.stop();
        };
    }, [connection, data.userId]);

    useEffect(() => {
        if (commentScroll.current) {
            const container = commentScroll.current;
            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 300;
            if (isAtBottom) {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [comments]);

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            setTimeout(() => {
                element?.scrollIntoView({ behavior: "smooth", block: "end" });
            }, 300);
        }
    }, [comments, location]);

    const addComment = async () => {
        if (!newText.trim()) {
            return Swal.fire({ title: "Error", text: "Comment cannot be empty", icon: "error" });
        }
        await axios.post(`${apiUrl}/Comment/Create`, { postId: id, text: newText }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewText("");
    };

    const editComment = async () => {
        await axios.put(`${apiUrl}/Comment/Update/${commentId}`, { postId: id, newText }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    };

    const toggleVisibility = async (commentId) => {
        try {
            await axios.put(`${apiUrl}/Comment/HiddenOrUnHidden/${commentId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            toast.error(err.response?.data);
        }
    };

    const likePost = async (postId) => {
        const endpoint = isLiked ? 'DeletePostLike' : 'CreatePostLike';

        try {
            await axios({
                method: isLiked ? 'delete' : 'post',
                url: `${apiUrl}/Like/${endpoint}/${postId}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {}
            });

            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? Math.max(0, prev - 1) : prev + 1);
        } catch (error) {
            console.error("Like emeliyyat zamani xəta:", error);
        }
    };

    const submitReport = async ({ reason, note }) => {
        setReportLoading(true);
        try {
            await axios.post(`${apiUrl}/UserReport/Create`, {
                ReportedUserId: data.userId,
                Reason: reason,
                Note: note,
                RelatedPostId: data.id.toString(),
                TargetType: "Post"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Report sent successfully");
            setShowReportModal(false);
        } catch (error) {
            toast.error(error.response?.data?.detail || "Error submitting report");
        } finally {
            setReportLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
            <ToastContainer />
            {loading && <Loader />}

            <div className="flex-1 space-y-6 pr-2">
                <div className="flex items-center gap-4 border-b pb-2">
                    <button onClick={() => window.history.back()}>
                        <IoArrowBackOutline className="w-5 h-5 cursor-pointer hover:text-red-700" />
                    </button>
                    {data.userImage ? (
                        <img src={data.userImage} alt="avatar" className="w-12 h-12 rounded-full border object-cover" />
                    ) : (
                        <FaUserCircle className="w-12 h-12 border rounded-full" />
                    )}
                    <div className="flex items-center justify-between w-full pr-3">
                        <div>
                            <Link to={`/userDetail/${data.userId}`}>
                                <h4 className="font-semibold hover:text-amber-700 text-lg">{data.userName}</h4>
                            </Link>
                            <p className="text-sm text-gray-500">{data.createdDate}</p>
                        </div>
                        {!data.isMine && (
                            <button onClick={() => setShowReportModal(true)} className="text-red-600 cursor-pointer hover:text-red-800">
                                <MdWarning size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center px-2">
                    <h2 className="text-2xl font-serif">{data.title}</h2>
                    <div className="flex items-center gap-2">
                        <p>{likeCount}</p>
                        <AiFillLike onClick={() => likePost(data.id)} className={`${isLiked ? "text-red-600" : "text-gray-500"} hover:text-red-700 cursor-pointer text-xl`} />
                    </div>
                </div>

                {data.mediaUrl && (
                    <div className="overflow-hidden rounded-lg shadow-md">
                        {data.isVideo ? (
                            <video controls className="w-full max-h-[500px] shadow-2xl" src={data.mediaUrl} />
                        ) : (
                            <img src={data.mediaUrl} alt="Post Media" className="w-full max-h-[450px] object-cover" />
                        )}
                    </div>
                )}

                <p className="text-black px-1 font-sans whitespace-pre-wrap leading-relaxed">
                    {formatDescription(data.desc)}
                </p>
            </div>

            <div className="w-full lg:w-[400px] bg-blue-50 p-4 rounded-lg shadow-xl lg:sticky lg:top-24">
                <div className="flex justify-between border-b pb-2 mb-2">
                    <h3 className="text-lg font-semibold text-blue-600">Comments</h3>
                    <span className="font-semibold">({comments.length})</span>
                </div>

                <div ref={commentScroll} className="space-y-4 md:h-[280px] lg:h-[380px] max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {comments.length > 0 ? comments.map(comment => (
                        <div id={`comment-${comment.id}`} key={comment.id}>
                            <Comment
                                comment={{ ...comment, isMine: comment.userId === getUserIdFromToken() }}
                                commentDelete={() => setComments(prev => prev.filter(c => c.id !== comment.id))}
                                handleEdit={(id, text) => {
                                    setCommentId(id);
                                    setNewText(text);
                                    setIsUpdate(true);
                                }}
                                changedHidden={toggleVisibility}
                                postOwnerId={data.userId}
                            />
                        </div>
                    )) : (
                        <p className="text-gray-500 text-sm italic">No comments yet.</p>
                    )}
                </div>

                <div id="input" className="pt-4 border-t mt-4">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="w-full px-3 py-2 border  bg-white rounded text-sm mb-2"
                    />
                    {isUpdate ? (
                        <div className="flex flex-col gap-1">
                            <button onClick={editComment} className="w-full py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                            <button onClick={() => { setIsUpdate(false); setNewText(""); }} className="w-full py-2 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
                        </div>
                    ) : (
                        <button onClick={addComment} className="w-full py-2 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600">Add</button>
                    )}
                </div>
            </div>

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={submitReport}
                loading={reportLoading}
                type="post"
            />
        </div>
    );
};

export default PostDetail;
