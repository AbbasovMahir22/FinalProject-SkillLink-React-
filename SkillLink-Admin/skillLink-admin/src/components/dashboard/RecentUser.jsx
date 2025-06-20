import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { Link } from "react-router-dom";
const RecentUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem("token");
    useEffect(() => {
        const getRecentUsers = async () => {
            setLoading(true);
            const res = await axios.get(`${apiUrl}/AdminAccount/GetRecentUsers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUsers(res.data.$values);
            setLoading(false);
        }
        getRecentUsers();
    }, [])
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-full sm:max-w-md md:max-w-full xl:max-w-full">
            {loading ? <Spinner /> : ""}
            <h2 className="text-2xl font-semibold text-blue-800 mb-4"> New Registrants</h2>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {users.map((user, index) => (
                    <Link key={index} to={`UserDetail/${user.id}`}>
                        <div
                            className="bg-gray-50 hover:bg-blue-50 transition rounded-xl shadow-sm p-4 flex items-center gap-4"
                        >
                            <img
                                src={user.imageUrl || "https://ui-avatars.com/api/?name=" + user.fullName}
                                alt="avatar"
                                className="w-14 h-14 rounded-full object-cover border border-blue-300"
                            />
                            <div className="flex flex-col justify-between">
                                <span className="font-semibold text-gray-900">{user.fullName}</span>
                                <p
                                    className="text-sm text-blue-600 hover:underline break-all"
                                >
                                    {user.email}
                                </p>
                                <span className="text-xs text-gray-500">
                                    Registration: {user.registerDate}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );

};

export default RecentUsers;
