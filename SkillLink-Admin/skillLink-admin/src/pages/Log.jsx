import React, { useEffect, useRef, useState, useCallback } from "react";
import { ClipboardList, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const LogPage = () => {
    const token = sessionStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const [logs, setLogs] = useState([]);
    const [entityFilter, setEntityFilter] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    const [userFilter, setUserFilter] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);

    const pageSize = 15;

    const fetchLogs = useCallback(async (reset = false) => {
        if (loading) return;

        setLoading(true);
        try {
            const currentPage = reset ? 1 : page;
            const params = {
                Page: currentPage,
                PageSize: pageSize,
                Action: actionFilter || undefined,
                EntityType: entityFilter || undefined,
                UserFullName: userFilter || undefined,
                SelectedDate: selectedDate || undefined,
            };

            const { data } = await axios.get(`${apiUrl}/Admin/Log/GetAllLogs`, {
                params,
                headers: { Authorization: `Bearer ${token}` },
            });

            const newLogs = Array.isArray(data) ? data : data?.$values || [];

            if (reset) {
                setLogs(newLogs);
                setPage(2);
            } else {
                setLogs((prev) => [
                    ...prev,
                    ...newLogs.filter((n) => !prev.some((p) => p.id === n.id)),
                ]);
                setPage((prev) => prev + 1);
            }

            setHasMore(newLogs.length === pageSize);
        } catch (error) {
            console.error("Error fetching logs:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [page, actionFilter, entityFilter, userFilter, selectedDate, token, apiUrl, loading]);

    useEffect(() => {
        fetchLogs(true);
    }, [actionFilter, entityFilter, userFilter, selectedDate]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchLogs();
                }
            },
            { threshold: 1.0 }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) observer.observe(currentLoader);

        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [hasMore, fetchLogs]);

    const getColor = (action) => {
        const a = action.toLowerCase();
        if (a === "deleted") return "bg-red-600 text-white";
        if (a === "created") return "bg-emerald-600 text-white";
        if (a === "updated") return "bg-yellow-500 text-black";
        if (a.includes("banned for")) return "bg-gray-300 text-red-600";
        if (a === "unbanned") return "bg-indigo-600 text-white";
        return "bg-slate-200 text-slate-800";
    };

    return (
        <div className="px-4 py-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <ClipboardList className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">Admin Logs</h1>
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
                <select
                    className="border p-2 rounded"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                >
                    <option value="">Select Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr className="bg-gray-300">
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entity</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entity Name</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-200">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                    {new Date(log.actionDate).toLocaleDateString("en-GB")} -
                                    {new Date(log.actionDate).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                    <Link to={`/UserDetail/${log.userId}`} className="text-blue-600 underline">
                                        {log.userFullName}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold">
                                    <span className={`inline-block px-2 py-1 text-xs rounded ${getColor(log.action)}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{log.entityType}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{log.entityName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div ref={loaderRef} className="py-4 text-center text-sm flex items-center justify-center text-gray-500">
                {loading ? <Loader className="animate-spin" /> : !hasMore && "No more logs"}
            </div>
        </div>
    );
};

export default LogPage;
