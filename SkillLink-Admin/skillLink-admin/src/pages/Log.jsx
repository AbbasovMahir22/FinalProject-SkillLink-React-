import React, { useEffect, useRef, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loader } from "lucide-react";
const LogPage = () => {
    const token = sessionStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const [logs, setLogs] = useState([]);
    const [entityFilter, setEntityFilter] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    const [userFilter, setUserFilter] = useState("");
    const [afterTime, setAfterTime] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);
    const pageSize = 15;

    const observer = useRef(null);

    const fetchLogs = async (reset = false) => {
        try {
            const currentPage = reset ? 1 : page;
            const params = {
                Page: currentPage,
                PageSize: pageSize,
                Action: actionFilter || undefined,
                EntityType: entityFilter || undefined,
                UserFullName: userFilter || undefined,
                AfterTime: afterTime || undefined,
            };

            const { data } = await axios.get(`${apiUrl}/Admin/Log/GetAllLogs`, {
                params,
                headers: { Authorization: `Bearer ${token}` },
            });

            const newLogs = Array.isArray(data) ? data : data.$values || [];

            setLogs((prev) =>
                reset ? newLogs : [...prev, ...newLogs.filter((n) => !prev.some((p) => p.id === n.id))]
            );

            setHasMore(newLogs.length === pageSize);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchLogs(true);
    }, [entityFilter, actionFilter, userFilter, afterTime]);

    useEffect(() => {
        if (!loader.current) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore) {
                    fetchLogs();
                }
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 1.0,
            }
        );

        observer.current.observe(loader.current);

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [hasMore, loader.current]);

    const getColor = (action) => {
        const a = action.toLowerCase();
        if (a === 'deleted') return 'bg-red-600 text-white';;
        if (a === 'created') return 'bg-emerald-600 text-white';
        if (a === 'updated') return 'bg-yellow-500 text-black';
        if (a === 'banned') return 'bg-gray-300 text-red-600';
        if (a === 'unbanned') return 'bg-indigo-600 text-white';
        return 'bg-slate-200 text-slate-800';
    };

    return (
        <div className="px-4 py-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <ClipboardList className="w-6 h-6 text-blue-600" />
                <div className="flex items-center justify-between px-3">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Logs</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Filter by User"
                    className="border p-2 rounded"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                />
                <select
                    className="border p-2 rounded"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                >
                    <option value="">All Actions</option>
                    <option value="Created">Created</option>
                    <option value="Updated">Updated</option>
                    <option value="Deleted">Deleted</option>
                    <option value="Banned">Banned</option>
                    <option value="Unbanned">Unbanned</option>
                </select>
                <select
                    className="border p-2 rounded"
                    value={entityFilter}
                    onChange={(e) => setEntityFilter(e.target.value)}
                >
                    <option value="">All Entities</option>
                    <option value="Category">Category</option>
                    <option value="SubCategory">SubCategory</option>
                    <option value="User">User</option>
                    <option value="Specialization">Specialization</option>
                </select>
                <input
                    type="time"
                    step="60"
                    className="border p-2 rounded"
                    value={afterTime}
                    onChange={(e) => setAfterTime(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr className="bg-gray-300">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Action
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Entity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Entity Name
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-200">
                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-sm text-gray-800">{log.actionDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-sm text-gray-800">
                                    <Link to={`/UserDetail/${log.userId}`} className="cursor-pointer ">
                                        {log.userFullName}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 font-semibold whitespace-nowrap text-sm">
                                    <span className={`inline-block px-2 py-1 text-xs  rounded ${getColor(log.action)}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-semibold whitespace-nowrap text-sm text-gray-800">{log.entityType}</td>
                                <td className="px-6 py-4 font-semibold whitespace-nowrap text-sm text-gray-800">{log.entityName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div ref={loader} className="py-4 text-center text-sm flex items-center justify-center text-gray-500">
                {hasMore ? <Loader /> : "No more logs"}
            </div>
        </div>
    );
};

export default LogPage;
