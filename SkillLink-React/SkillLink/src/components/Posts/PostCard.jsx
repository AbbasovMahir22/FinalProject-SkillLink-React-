import React from 'react';
import { AiFillLike } from "react-icons/ai";
import { FaCommentDots, FaPlay } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

const truncateWords = (text, maxWords) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
};

const PostCard = ({ post }) => {
    const navigate = useNavigate();

    const goToDetail = () => {
        navigate(`/PostDetail/${post.id}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 cursor-pointer hover:shadow-2xl hover:scale-[1.02] select-none relative max-w-sm w-full flex flex-col h-auto">

            {post.isVideo ? (
                <div
                    className="relative w-full h-48 sm:h-56 rounded-t-lg overflow-hidden"
                    onClick={goToDetail}
                >
                    <video
                        className="w-full h-full object-cover"
                        src={post.mediaUrl}
                        muted
                        preload="metadata"
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToDetail();
                        }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-4 flex items-center justify-center cursor-pointer"
                        aria-label="Play Video"
                    >
                        <FaPlay className="text-3xl" />
                    </button>
                    <div className='absolute top-3 left-3 bg-amber-300 bg-opacity-90 px-2 py-0.5 rounded-md text-xs font-semibold text-gray-800 shadow-md'>
                        {post.category}{post.subCategory ? ` / ${post.subCategory}` : ""}
                    </div>
                </div>
            ) : (
                <Link to={`/PostDetail/${post.id}`} className="block relative group">
                    <img
                        src={post.mediaUrl}
                        alt={post.title || "Post media"}
                        className="w-full h-48 sm:h-56 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className='absolute top-3 left-3 bg-amber-300 bg-opacity-90 px-2 py-0.5 rounded-md text-xs font-semibold text-gray-800 shadow-md'>
                        {post.category}{post.subCategory ? ` / ${post.subCategory}` : ""}
                    </div>
                </Link>
            )}

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <Link to={`/UserDetail/${post.appUserId}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <img
                                src={post.userImage}
                                alt={post.userName || "User avatar"}
                                className='w-9 h-9 rounded-full object-cover border shadow-sm'
                            />
                            <h1 className="text-sm font-semibold text-gray-900 hover:text-red-500 whitespace-nowrap">{post.userName}</h1>
                        </Link>
                    </div>

                    <h2 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">{post.title}</h2>

                    <p
                        className="text-gray-700 text-xs mb-4 max-h-[72px] overflow-hidden"
                        title={post.desc}
                    >
                        {truncateWords(post.desc, 18)}
                    </p>
                </div>

                <div className='flex items-center justify-between text-lg text-gray-700 pt-2 border-t border-gray-200'>
                    <button className='flex items-center gap-1 text-red-600 hover:text-red-800 transition'>
                        <AiFillLike className='cursor-pointer' />
                        <span className='font-semibold text-sm'>{post.likeCount}</span>
                    </button>
                    <div className='flex items-center gap-1 text-blue-600'>
                        <span className='font-semibold text-sm'>{post.commentCount}</span>
                        <FaCommentDots className='cursor-pointer' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
