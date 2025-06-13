import { useState } from 'react';
import { AiFillLike } from "react-icons/ai";
import { FaCommentDots, FaPlay } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import LikerModal from './LikerModel';
import EditPostModal from '../User/EditPostModal';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import Swal from 'sweetalert2';
import { FaUserCircle } from "react-icons/fa";


const truncateWords = (text, maxWords) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
};
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
const PostCard = ({ post, isMyProfile = false }) => {
    const navigate = useNavigate();
    const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(post);
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    const openEditModal = (e) => {
        e.stopPropagation();
        setIsEditModalOpen(true);
    };
    const handleSave = async (updatedPost) => {
        setLoading(true);
        setIsEditModalOpen(false);

        const token = localStorage.getItem("token");
        try {

            const response = await axios.put(`${apiUrl}/Post/Update/${post.id}`, updatedPost, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setCurrentPost(response.data);
            setLoading(false);
        }
        catch (error) {
            console.log(error);

            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: error.response?.data?.detail || 'Please try again',
                confirmButtonColor: '#d33'
            });
        }
    }


    const goToDetail = () => navigate(`/PostDetail/${currentPost.id}`);

    return (
        <div className="bg-gray-200 rounded-lg shadow-2xl overflow-hidden transition duration-300 cursor-pointer hover:shadow-yellow-950 hover:scale-[1.01] select-none relative max-w-sm w-full flex flex-col h-auto">
            {loading && <Loader />}
            {isMyProfile && (
                <div>
                    <button
                        onClick={openEditModal}
                        className="absolute top-3 right-3 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded shadow-md z-10"
                    >
                        <GrEdit size={20} />
                    </button>
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();
                            const token = localStorage.getItem("token");
                            await axios.delete(`${apiUrl}/Post/Delete/${post.id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            window.location.reload();
                        }}
                        className="absolute top-12 right-3 cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded shadow-md z-5"
                    >
                        <MdDelete size={20} />
                    </button>
                </div>
            )}

            {currentPost.isVideo ? (
                <div
                    className="relative w-full h-48 sm:h-56 rounded-t-lg overflow-hidden"
                    onClick={goToDetail}
                >
                    <video
                        className="w-full h-full object-cover"
                        src={currentPost.mediaUrl}
                        muted
                        preload="metadata"
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToDetail();
                        }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-4"

                    >
                        <FaPlay className="text-3xl" />
                    </button>
                    <div className='absolute top-3  left-3 bg-amber-300 bg-opacity-90 px-2 py-0.5 rounded-md text-xs font-semibold text-gray-800 shadow-md'>
                        {currentPost.category}{currentPost.subCategory ? ` / ${currentPost.subCategory}` : ""}
                    </div>
                </div>
            ) : (
                <Link to={`/PostDetail/${currentPost.id}`} className="block relative group">
                    {currentPost.mediaUrl ? (
                        <img
                            src={currentPost.mediaUrl}
                            alt={currentPost.title || "Post media"}
                            className="w-full h-48 sm:h-56 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <FaUserCircle className="w-48 h-48 border shadow-sm rounded-full transiation duration-300 group-hover:scale-105" />

                    )}
                    <div className='absolute top-3 left-3 bg-amber-300 bg-opacity-90 px-2 py-0.5 rounded-md text-xs font-semibold text-gray-800 shadow-md'>
                        {currentPost.category}{currentPost.subCategory ? ` / ${currentPost.subCategory}` : ""}
                    </div>
                </Link>
            )}

            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        {isMyProfile ? (
                            <div className="flex items-center gap-2 hover:opacity-80">
                                {currentPost.userImage ? (
                                    <img
                                        src={currentPost.userImage}
                                        alt={currentPost.userName || "User avatar"}
                                        className='w-9 h-9 rounded-full object-cover border shadow-sm'
                                    />
                                ) : (
                                    <FaUserCircle className='w-9 h-9' />
                                )}
                                <h1 className="text-sm font-semibold text-gray-900 ">{currentPost.userName}</h1>
                            </div>
                        ) : (
                            <Link to={`/UserDetail/${currentPost.appUserId}`} className="flex items-center gap-2 hover:opacity-80">
                                {currentPost.userImage ? (
                                    <img
                                        src={currentPost.userImage}
                                        alt={currentPost.userName || "User avatar"}
                                        className='w-9 h-9 rounded-full object-cover border shadow-sm'
                                    />
                                ) : (
                                    <FaUserCircle className='w-9 h-9' />
                                )}
                                <h1 className="text-sm font-semibold text-gray-900 hover:text-red-500">{currentPost.userName}</h1>
                            </Link>
                        )}
                    </div>

                    <h2 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">{currentPost.title}</h2>
                    <p className="text-gray-700 text-xs mb-4 max-h-[72px] overflow-hidden break-words">
                        {formatDescription(truncateWords(currentPost.desc, 18))}
                    </p>
                </div>

                <div className='flex items-center justify-between text-lg text-gray-700 pt-2 border-t border-gray-200'>
                    <button
                        onClick={() => setIsLikeModalOpen(true)}
                        className='flex items-center cursor-pointer hover:shadow-2xl gap-1 text-red-600 hover:text-red-800'
                    >
                        <AiFillLike />
                        <span className='font-semibold text-sm'>{currentPost.likeCount}</span>
                    </button>
                    <div className='flex items-center gap-1 text-blue-600'>
                        <span className='font-semibold text-sm'>{currentPost.commentCount}</span>
                        <FaCommentDots />
                    </div>
                </div>
            </div>

            <EditPostModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                post={currentPost}
                onSave={handleSave}
            />

            <LikerModal
                postId={currentPost.id}
                isOpen={isLikeModalOpen}
                onClose={() => setIsLikeModalOpen(false)}
            />
        </div>

    );

};

export default PostCard;
