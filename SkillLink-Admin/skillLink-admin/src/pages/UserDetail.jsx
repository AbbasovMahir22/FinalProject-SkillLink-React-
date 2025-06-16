import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { FaShieldAlt, FaUserSlash } from "react-icons/fa";

export default function UserDetail() {
    const { id } = useParams();
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem("token");

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isBanned, setIsBanned] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${apiUrl}/AdminAccount/GetUserForAdmin/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const dto = res.data;
                setUser(dto);
                setIsBanned(dto.isBanned);
            } catch (err) {
                toast.error("User could not be loaded");
            }
            setLoading(false);
        };
        fetchUser();
    }, [id, apiUrl, token]);

    const toggleBan = async () => {
        try {
            await axios.put(
                `${apiUrl}/AdminAccount/UpdateUserBanned/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsBanned((prev) => !prev);
            toast.success(isBanned ? "User un‑banned" : "User banned");
        } catch {
            toast.error("Ban toggle failed");
        }
    };

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center h-60">
                <Spinner />
            </div>
        );
    }

    const roles = user.roles?.$values ?? user.roles ?? [];

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-cyan-50 rounded-2xl shadow-md border">
            {/* header */}
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
                    <img
                        src={
                            user.imageUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}`
                        }
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 break-words">
                            {user.fullName}
                        </h2>

                        {!user.isMine && (
                            <button
                                onClick={toggleBan}
                                className={`flex items-center gap-2 py-1 px-3 rounded text-white ${isBanned
                                    ? "bg-red-600 cursor-pointer hover:bg-red-700"
                                    : "bg-green-600 cursor-pointer hover:bg-green-700"
                                    }`}
                            >
                                {isBanned ? <FaUserSlash /> : <FaShieldAlt />}
                                {isBanned ? "Unban" : "Ban"}
                            </button>
                        )}
                    </div>

                    <p className="text-gray-600">
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold">Specialization:</span>{" "}
                        {user.specialization ?? "—"}
                    </p>
                    <p className="text-sm text-gray-400 break-words">ID: {user.id}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        {roles.map((r) => (
                            <span
                                key={r}
                                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                                {r}
                            </span>
                        ))}
                        <span
                            className={`px-3 py-1 text-xs rounded-full ${user.isConfirmed
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {user.isConfirmed ? "Email Confirmed" : "Email NOT Confirmed"}
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
}

const Stat = ({ label, value }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
        <p className="text-xl font-bold text-indigo-600">{value}</p>
        <p className="text-xs md:text-sm text-gray-500 break-words">{label}</p>
    </div>
);
