import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Users, FileText, Bell, Sparkles } from "lucide-react";
import Spinner from "../Spinner";
function TotalCount() {
    const [totalCount, setTotalCount] = useState([]);
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const getTotalCount = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${apiUrl}/AdminAccount/GetDashboardTotalCount`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = res.data;

                const mappedStats = [
                    {
                        title: "Users",
                        value: data.userCount,
                        icon: <Users />,
                        bg: "bg-blue-500"
                    },
                    {
                        title: "Posts",
                        value: data.postCount,
                        icon: <FileText />,
                        bg: "bg-green-500"
                    },
                    {
                        title: "Notifications",
                        value: data.notificationCount,
                        icon: <Bell />,
                        bg: "bg-yellow-500"
                    },
                    {
                        title: "New Registrations",
                        value: data.newRegistrationsCount,
                        icon: <Sparkles />,
                        bg: "bg-purple-500"
                    }
                ];

                setTotalCount(mappedStats);
                setLoading(false);
            } catch (error) {
                console.error("Dashboard statistika alinarken xəta:", error);
            }
        };
        getTotalCount();
    }, []);

    return (
        <div>
            {loading ? <Spinner /> : ""}
            <h2 className="text-2xl font-bold mb-6">📊 Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {totalCount.map((stat, index) => (
                    <div
                        key={index}
                        className="flex items-center p-5 rounded-2xl shadow bg-white hover:bg-amber-300 transition"
                    >
                        <div className={`w-14 h-14 flex items-center justify-center text-2xl text-white rounded-full ${stat.bg} mr-4`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{stat.title}</p>
                            <p className="text-xl font-semibold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TotalCount;
