import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import Loader from "../Loader";

const SuggestedUsers = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchUsers = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${apiUrl}/Account/GetAllSuggestUser`,
                {
                    params: { page, limit },
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : undefined,
                }
            );

            const newUsers = response.data.users.$values;
            const total = response.data.totalCount;

            setUsers((prev) => [...prev, ...newUsers]);
            setTotalCount(total);
        } catch (err) {
            setError("Failed to load suggested users.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, limit, loading]);

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handleScroll = useCallback(() => {
        if (loading) return;

        const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
        const bottom = document.documentElement.offsetHeight;

        if (scrollPosition >= bottom - 100 && users.length < totalCount) {
            setPage((prev) => prev + 1);
        }
    }, [loading, users.length, totalCount]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {users.length > 0 && (
                <h2 className="text-2xl  font-bold mb-6 text-gray-800">Suggested Users</h2>

            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>

            {loading && <Loader />}
            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            {!loading && users.length >= totalCount && (
                <p className="text-center mt-4 text-gray-600">No more users to load.</p>
            )}
        </div>
    );
};

export default SuggestedUsers;
