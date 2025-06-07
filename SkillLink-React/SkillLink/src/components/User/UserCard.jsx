import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import axios from "axios";
const UserCard = ({ user, setUsers }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    const followUser = async (id) => {
        await axios.post(`${apiUrl}/UserFollow/Create/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        setUsers((prev) => prev.filter((user) => user.id !== id))
    }

    return (
        <div className="bg-amber-50 rounded-2xl shadow-md p-5 hover:shadow-amber-500 transition duration-300 border border-gray-100">
            <div className="flex flex-col items-center text-center">
                {user.imageUrl ? (
                    <img
                        src={user.imageUrl}
                        alt={user.fullName}
                        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-100"
                    />
                ) : (
                    <FaUser className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-100" />
                )}
                <h3 className="text-xl font-semibold text-gray-800">{user.fullName}</h3>
                <p className="text-sm text-blue-600 font-medium mt-1 mb-4">{user.specialization}</p>

                <div className="grid grid-cols-3 gap-4 bg-yellow-50 px-4 py-2 rounded-lg text-sm text-gray-700 font-medium mb-4 w-full">
                    <div className="flex flex-col items-center">
                        <span className="text-base font-bold text-gray-800">{user.followerCount}</span>
                        <span className="text-xs text-gray-500">Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-base font-bold text-gray-800">{user.followingCount}</span>
                        <span className="text-xs text-gray-500">Following</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-base font-bold text-gray-800">{user.postCount}</span>
                        <span className="text-xs text-gray-500">Posts</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => followUser(user.id)} className="px-5 py-2  cursor-pointer bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition">
                        Follow
                    </button>
                    <Link
                        to={`/userDetail/${user.id}`}
                        className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-semibold hover:bg-yellow-300 transition"
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
