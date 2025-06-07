import { useEffect, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import axios from 'axios';

export default function UserListPanel({ onUserSelect, className }) {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const getUsers = async () => {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiUrl}/PrivateChat/GetExistUsers`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.$values);
        };

        getUsers();
    }, []);

    const handleSelect = (user) => {
        setSelectedUserId(user.id);
        onUserSelect(user);
    };

    return (
        <div className={`${className} bg-gradient-to-b w-full max-h-[650px] min-h-[650px] overflow-x-hidden  from-cyan-100 to-cyan-50 p-4 overflow-y-auto shadow-inner`}>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Users</h2>
            <ul className="space-y-2">
                {users.map(user => {
                    const isSelected = user.id === selectedUserId;

                    return (
                        <li
                            key={user.id}
                            onClick={() => handleSelect(user)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200
                                group
                                ${isSelected
                                    ? 'bg-yellow-200 border border-yellow-400 shadow-md'
                                    : 'hover:bg-yellow-100 hover:shadow-sm'}
                            `}
                        >
                            {user.imgUrl ? (
                                <img
                                    src={user.imgUrl}
                                    alt="User avatar"
                                    className={`w-10 h-10 rounded-full object-cover border-2 transition
                                    ${isSelected
                                            ? 'border-yellow-500'
                                            : 'border-cyan-300 group-hover:border-yellow-400'}
                                `}
                                />
                            ) : (
                                <FaUserCircle className='w-10 h-10' />
                            )}
                            <span className={`text-[16px] font-medium transition
                                ${isSelected ? 'text-yellow-700' : 'text-gray-800 group-hover:text-yellow-600'}`}
                            >
                                {user.fullaname}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
