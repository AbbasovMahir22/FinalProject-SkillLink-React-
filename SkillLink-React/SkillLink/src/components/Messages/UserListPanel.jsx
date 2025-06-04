import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserListPanel({ onUserSelect }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const token = localStorage.getItem("token");
            const datas = await axios.get("https://localhost:7067/api/PrivateChat/GetExistUsers", {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            })
            setUsers(datas.data.$values);

        }
        getUsers();
    }, []);

    return (
        <div className="w-1/3 md:w-1/4 border-r  p-4 overflow-x-auto bg-cyan-50">
            <h2 className="text-xl font-bold mb-4">Users</h2>
            <ul>
                {users.map(user => (
                    <li
                        key={user.id}
                        onClick={() => onUserSelect(user)}
                        className="cursor-pointer py-2 border-b-2  transition duration-300 hover:bg-yellow-300"
                    >
                        <div className='flex items-center justify-start gap-2'>
                            <img src={user.imgUrl} className='w-[35px] h-[35px] rounded-full object-cover'/>
                            <p className='text-[18px]'>{user.fullaname}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}