import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import UserListModal from "../User/UserListModal";
import { FaUserCircle } from "react-icons/fa";

const Comment = ({ comment, commentDelete, handleEdit }) => {
    const token = localStorage.getItem("token");
    const commentRef = useRef(null);
    const [likes, setLikes] = useState(comment.likeCount);
    const [liked, setLiked] = useState(comment.isLiked);
    const [commentLikers, setCommentLikers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    const openLikers = async (commentId) => {
        const likers = await axios.get(`${apiUrl}/Like/GetAllLikerByCommentId/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setCommentLikers(likers.data.$values);
        setShowModal(true);
        console.log(commentLikers);

    }
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

        if (commentRef.current) {
            observer.observe(commentRef.current);
        }

        return () => {
            if (commentRef.current) {
                observer.unobserve(commentRef.current);
            }
        };
    }, [comment.id]);

    const handleDelete = async (commentId) => {
        const token = localStorage.getItem("token");
        await axios.delete(`${apiUrl}/Comment/Delete/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        commentDelete(commentId);
    }
    const handleLike = async () => {
        const token = localStorage.getItem("token");

        if (!liked) {
            await axios.post(`${apiUrl}/Like/CreateCommentLike/${comment.id}`,
                {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLikes(prev => prev + 1);

        } else {
            await axios.delete(`${apiUrl}/Like/DeleteCommentLike/${comment.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setLikes(prev => prev - 1);

        }
        setLiked(!liked);
    };

    return (
        <div
            id={`comment-${comment.id}`}
            ref={commentRef}
            className=" hover:bg-amber-200   transition duration-300 p-2 border-b flex gap-3"
        >
            {comment.userImg ? (
                <img src={comment.userImg} alt="avatar" className="w-8 h-8 rounded-full" />
            ) : (
                <FaUserCircle className="w-8 h-8" />
            )}
            <div className="flex-1 ">
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
                        className={`flex items-center gap-1 ${liked ? "text-blue-600" : "hover:text-blue-500"}`}
                    >
                        <AiFillLike onClick={handleLike} size={18} className={`  hover:text-red-600 cursor-pointer ${liked ? "text-red-500" : "text-gray-800"}`} />
                        <span className="cursor-pointer" onClick={() => openLikers(comment.id)}>{likes}</span>
                    </button>
                    {comment.isMine && (
                        <div className="flex gap-0.5">
                            <button onClick={() => handleEdit(comment.id, comment.commentText)} className="flex text-gray-400">
                                <MdEdit size={18} className="text-gray-600 cursor-pointer hover:text-red-500" />
                            </button>
                            <button onClick={() => handleDelete(comment.id)} className="flex text-gray-400 ">
                                <MdDelete size={18} className="text-gray-600 cursor-pointer hover:text-red-500" />
                            </button>
                        </div>
                    )}

                </div>
            </div>
            {showModal && (
                <UserListModal
                    users={commentLikers}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default Comment;
