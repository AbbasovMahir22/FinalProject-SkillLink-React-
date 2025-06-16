import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import UserListModal from "../User/UserListModal";
import { FaUserCircle } from "react-icons/fa";
import ReportModal from "./ReportModal";
import { toast } from "react-toastify";
import { MdWarning } from "react-icons/md";

const Comment = ({ comment, commentDelete, handleEdit }) => {
    const token = localStorage.getItem("token");
    const commentRef = useRef(null);
    const [likes, setLikes] = useState(comment.likeCount);
    const [liked, setLiked] = useState(comment.isLiked);
    const [commentLikers, setCommentLikers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    const openLikers = async (commentId) => {
        try {
            const likers = await axios.get(`${apiUrl}/Like/GetAllLikerByCommentId/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCommentLikers(likers.data.$values);
            setShowModal(true);
        } catch (error) {
            console.error("Failed to fetch likers", error);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const isTargeted = window.location.hash === `#comment-${comment.id}`;
                if (entry.isIntersecting && isTargeted) {
                    const el = commentRef.current;
                    el.classList.add("highlight");
                    setTimeout(() => {
                        el.classList.remove("highlight");
                    }, 1500);
                }
            },
            { threshold: 0.9 }
        );

        if (commentRef.current) observer.observe(commentRef.current);
        return () => {
            if (commentRef.current) observer.unobserve(commentRef.current);
        };
    }, [comment.id]);

    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`${apiUrl}/Comment/Delete/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            commentDelete(commentId);
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete comment.");
        }
    };

    const handleLike = async () => {
        try {
            if (!liked) {
                await axios.post(`${apiUrl}/Like/CreateCommentLike/${comment.id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLikes((prev) => prev + 1);
            } else {
                await axios.delete(`${apiUrl}/Like/DeleteCommentLike/${comment.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLikes((prev) => prev - 1);
            }
            setLiked(!liked);
        } catch (error) {
            console.error("Like/unlike failed", error);
            alert("Failed to update like status.");
        }
    };

    const submitReport = async ({ reason, note }) => {
        setReportLoading(true);
        try {
            await axios.post(`${apiUrl}/UserReport/Create`,
                {
                    ReportedUserId: comment.userId,
                    Reason: reason,
                    Note: note,
                    RelatedCommentId: comment.id.toString(),
                    RelatedPostId: comment.postId.toString(),
                    TargetType: "Comment",
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("Report send successfully");
            setShowReportModal(false);
            setReportLoading(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.detail);
            setReportLoading(false);
        }
    };

    return (
        <>
            <div
                id={`comment-${comment.id}`}
                ref={commentRef}
                className="hover:bg-amber-200 transition duration-300 p-2 border-b flex gap-3"
            >
                {comment.userImg ? (
                    <img src={comment.userImg} alt="avatar" className="w-8 h-8 rounded-full" />
                ) : (
                    <FaUserCircle className="w-8 h-8" />
                )}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <Link to={`/userDetail/${comment.userId}`}>
                            <div className="font-semibold text-sm cursor-pointer hover:text-red-500">
                                {comment.userFullName}
                            </div>
                        </Link>
                        <div className="text-xs text-gray-500">{comment.createdDate}</div>
                    </div>
                    <div className="text-sm mt-1">{comment.commentText}</div>

                    <div className="flex items-center justify-between gap-2 mt-2 text-sm text-gray-600">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 ${liked ? "text-blue-600" : "hover:text-blue-500"
                                }`}
                            aria-label="Like comment"
                        >
                            <AiFillLike
                                size={18}
                                className={`cursor-pointer ${liked ? "text-red-500" : "text-gray-800"}`}
                            />
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={() => openLikers(comment.id)}
                                onKeyDown={(e) => e.key === "Enter" && openLikers(comment.id)}
                                className="cursor-pointer select-none"
                                aria-label="Show likers"
                            >
                                {likes}
                            </span>
                        </button>

                        {!comment.isMine && (
                            <button
                                onClick={() => setShowReportModal(true)}
                                className="text-sm cursor-pointer text-red-600 hover:text-red-800"
                            >
                                <MdWarning size={18} />

                            </button>
                        )}
                        {comment.isMine && (
                            <div className="flex gap-0.5">
                                <button
                                    onClick={() => handleEdit(comment.id, comment.commentText)}
                                    className="text-gray-400"
                                    aria-label="Edit comment"
                                >
                                    <MdEdit size={18} className="text-gray-600 cursor-pointer hover:text-red-500" />
                                </button>
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-gray-400"
                                    aria-label="Delete comment"
                                >
                                    <MdDelete size={18} className="text-gray-600 cursor-pointer hover:text-red-500" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {showModal && <UserListModal users={commentLikers} onClose={() => setShowModal(false)} />}
            </div>

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={submitReport}
                loading={reportLoading}
                type={"comment"}
            />
        </>
    );
};

export default Comment;
