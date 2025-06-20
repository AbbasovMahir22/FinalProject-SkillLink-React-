import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";

const UserListModal = ({ title, users, onClose, onUserClick }) => {
    const token = localStorage.getItem("token");
    const [userList, setUserList] = useState(users);
    const [searchTerm, setSearchTerm] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        setUserList(users);
    }, [users]);

    const filteredUsers = userList.filter(user =>
        user.userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const followOrUnFollow = async (userId, currentIsFollow) => {
        try {
            if (!currentIsFollow) {
                await axios.post(`${apiUrl}/UserFollow/Create/${userId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.delete(`${apiUrl}/UserFollow/Delete/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            const updatedUsers = userList.map(user =>
                user.userId === userId ? { ...user, isFollow: !currentIsFollow } : user
            );
            setUserList(updatedUsers);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-yellow-50 relative min-h-[300px] max-h-[500px] overflow-y-scroll rounded-xl shadow-lg p-6 w-full max-w-md">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 z-10 text-black cursor-pointer hover:text-red-600">
                    <MdCancel size={25} />
                </button>
                {users.length > 0 && (
                    <div>
                        <div className="sticky -top-6 p-2 bg-yellow-100">
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                className="w-full border p-2 bg-gray-100 rounded"
                                placeholder="Search users..."
                            />
                            <div className="flex items-center justify-between relative">
                                <h2 className="text-xl w-full flex items-center justify-between font-semibold mb-4">
                                    <span>{title}:</span>
                                    <span>{users.length}</span>
                                </h2>
                            </div>
                        </div>



                        <div className="space-y-3 max-h-[300px]">
                            {filteredUsers.map((user, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between gap-3 p-2 hover:bg-amber-200 cursor-pointer transition duration-300"
                                >
                                    <div className="flex items-center gap-3">
                                        {user.userImg ? (
                                            <img
                                                src={user.userImg}
                                                alt="avatar"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <FaUserCircle className="w-10 h-10" />
                                        )}
                                        <div>
                                            <Link onClick={onUserClick} to={`/userdetail/${user.userId}`}>
                                                <p className="font-medium">{user.userFullName}</p>
                                                <p className="text-sm text-gray-500">{user.specialization}</p>
                                            </Link>
                                        </div>
                                    </div>
                                    {!user.isMine && (
                                        <button
                                            onClick={() => followOrUnFollow(user.userId, user.isFollow)}
                                            className={`p-1 w-[80px] rounded text-white text-sm ${user.isFollow ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                                        >
                                            {user.isFollow ? "Unfollow" : "Follow"}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default UserListModal;