import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LikerModal = ({ postId, isOpen, onClose }) => {
    const [likes, setLikes] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (postId && isOpen) {
            const getLikers = async () => {
                const likers = await axios.get(`${apiUrl}/Like/GetAllLikersByPostId/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setLikes(likers.data.$values);
            }
            getLikers();

        }
    }, [postId, isOpen]);

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <div className="fixed inset-0   bg-opacity-50 backdrop-blur-xs flex justify-center items-center">
                <Dialog.Panel className=" p-6 rounded-lg  bg-yellow-100 shadow-lg w-96">
                    <button onClick={onClose} className="text-black hover:text-gray-700 text-xl absolute top-4 right-4"></button>
                    <h2 className="text-lg font-semibold mb-4">Liked by</h2>
                    <div className="space-y-4  h-[230px] px-0.5 overflow-y-auto overflow-x-hidden">
                        {likes.length > 0 ? likes.map(like => (
                            <Link key={like.userId} to={`/userDetail/${like.userId}`}>

                                <div className="flex hover:bg-gray-200 mt-3 items-center border-b rounded-xs transiation duration-300  space-x-3">
                                    <img
                                        src={like.userImage}
                                        alt={like.userName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className='flex flex-col '>
                                        <span className="cursor-pointer font-semibold ">{like.userName}</span>

                                        <span className="text-[13px]">{like.createdDate}</span>
                                    </div>
                                </div>
                            </Link>

                        )) : (
                            <p>No likes yet</p>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default LikerModal;
