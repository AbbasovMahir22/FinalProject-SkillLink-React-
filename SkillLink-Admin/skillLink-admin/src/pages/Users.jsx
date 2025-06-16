import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { FaBan, FaUserCheck, FaArrowsRotate } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Users() {
    const token = sessionStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const [users, setUsers] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [sortOrder, setSortOrder] = useState("desc");
    const [statusFilter, setStatusFilter] = useState("all");

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const observer = useRef();
    const lastRowRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) setPageNumber((p) => p + 1);
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const fetchUsers = async (reset = false) => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/Admin/User/GetAllUserForAdmin`, {
                params: {
                    pageNumber,
                    pageSize: 20,
                    search: searchTerm,
                    sortOrder,
                    status: statusFilter
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetched = res.data.$values;
            reset ? setUsers(fetched) : setUsers((prev) => [...prev, ...fetched]);
            setHasMore(fetched.length === 20);
        } catch {
            toast.error("Failed to fetch users");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers(pageNumber === 1);
    }, [pageNumber, searchTerm, sortOrder, statusFilter]);

    useEffect(() => {
        setPageNumber(1);
        setUsers([]);
        setHasMore(true);
    }, [searchTerm, sortOrder, statusFilter]);



    const openRoleModal = (user) => {
        setSelectedUser(user);
        setShowRoleModal(true);
    };

    return (
        <div className="p-6 select-none relative max-w-full overflow-x-auto">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
                <h1 className="text-2xl font-semibold">Users</h1>

                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <input
                        type="text"
                        placeholder="Search"
                        className="rounded border p-2 flex-1 min-w-[160px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="rounded border p-2 cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="banned">Banned</option>
                        <option value="unbanned">Unbanned</option>
                    </select>
                    <select
                        className="rounded border p-2 cursor-pointer"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="desc">New → Old</option>
                        <option value="asc">Old → New</option>
                    </select>
                </div>
            </div>

            <table className="w-full table-fixed bg-white shadow-md rounded-lg overflow-hidden text-xs md:text-sm">
                <thead className="bg-gray-300 whitespace-nowrap ">
                    <tr>
                        <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3">Image</th>
                        <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3">Name</th>
                        <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 hidden sm:table-cell">
                            Email
                        </th>
                        <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 text-center hidden md:table-cell">
                            Banned
                        </th>
                        <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, idx) => {
                        const isLast = idx === users.length - 1;
                        return (
                            <tr
                                key={u.id}
                                ref={isLast ? lastRowRef : null}
                                className="border-b hover:bg-yellow-100 duration-300"
                            >
                                <td className="px-2 md:px-4 lg:px-6 py-2 md:py-4">
                                    <img
                                        src={
                                            u.imageUrl ||
                                            "https://openclipart.org/image/2000px/247319"
                                        }
                                        alt={u.fullName}
                                        className="w-[55px] h-[55px] rounded-full object-cover"
                                    />
                                </td>

                                <td className="px-2 md:px-4 lg:px-6 py-2 md:py-4 max-w-[140px] md:max-w-none font-semibold break-words">
                                    <Link
                                        to={`/UserDetail/${u.id}`}
                                        className="hover:underline text-blue-600"
                                    >
                                        {u.fullName}
                                    </Link>
                                </td>

                                <td className="px-2 md:px-4 lg:px-6 py-2 md:py-4 hidden sm:table-cell break-all max-w-[160px] md:max-w-none">
                                    {u.email}
                                </td>

                                <td className="px-2 md:px-4 lg:px-6 py-2 md:py-4 text-center hidden md:table-cell">
                                    {u.isBanned ? "Yes" : "No"}
                                </td>

                                <td className="px-2 md:px-4 lg:px-6 py-2 md:py-4 flex justify-end gap-3 min-w-[90px]">
                                   
                                    <button
                                    >
                                        action
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {loading && <Spinner />}

            {showRoleModal && selectedUser && (
                <RoleModal
                    currentRole={selectedUser.role}
                    onClose={() => setShowRoleModal(false)}
                    onSave={changeRole}
                />
            )}
        </div>
    );
}
