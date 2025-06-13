import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from "../components/Spinner";

const UserDetail = () => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem("token");
    const [isBanned, setIsBanned] = useState();

    const userId = useParams();

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/AdminAccount/GetUserForAdmin/${userId.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(res.data);
            setRoles(res.data.roles.$values);
            setIsBanned(res.data.isBanned);
            setLoading(false);
        }
        getUser();
    }, [])
    const bannedUser = async (id) => {
        await axios.put(`${apiUrl}/AdminAccount/UpdateUserBanned/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setIsBanned(!isBanned)

    }


    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-cyan-50 rounded-2xl shadow-md border">
            {loading ? <Spinner /> : ""}
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
                    <img
                        src={user.imageUrl || "https://ui-avatars.com/api/?name=" + user.fullName}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 space-y-2">
                    <div className='flex items-center justify-between'>
                        <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
                        {!user.isMine && (
                            <button onClick={() => bannedUser(user.id)} className={`py-1 px-2 cursor-pointer text-white border ${isBanned ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}   rounded`}>{isBanned ? "UnBanned" : "Banned"}</button>
                        )}
                    </div>
                    <p className="text-gray-600"><span className="font-semibold">Email:</span> {user.email}</p>
                    <p className="text-gray-600"><span className="font-semibold">Specialization:</span> {user.specialization}</p>
                    <p className="text-sm text-gray-400">ID: {user.id}</p>

                    <div className="flex items-center gap-3 mt-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">{roles.join(', ')}</span>
                        <span className={`px-3 py-1 text-sm rounded-full ${user.isConfirmed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.isConfirmed ? 'Email Confirmed' : 'Email Not Confirmed'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
                <Stat label="Posts" value={user.postCount} />
                <Stat label="Comments" value={user.commentsCount} />
                <Stat label="Likes" value={user.likeCount} />
                <Stat label="Followers" value={user.followerCount} />
                <Stat label="Following" value={user.followingCount} />
                <Stat label="Notifications" value={user.notificationCount} />
                <Stat label="Sent Messages" value={user.sentMessagesCount} />
                <Stat label="Received Messages" value={user.receivedMessagesCount} />
            </div>
        </div>
    );
};

const Stat = ({ label, value }) => (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm border">
        <p className="text-xl font-bold text-indigo-600">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
    </div>
);

export default UserDetail;
