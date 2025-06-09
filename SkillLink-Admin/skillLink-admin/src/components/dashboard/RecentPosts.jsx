import React from "react";

const posts = [
    {
        id: 1,
        title: "React ilə Dashboard yaratmaq",
        author: "Elvin",
        date: "2025-06-08",
    },
    {
        id: 2,
        title: "Backend üçün REST API dizaynı",
        author: "Aysel",
        date: "2025-06-07",
    },
    {
        id: 3,
        title: "UI/UX dizayn trendleri 2025",
        author: "Samir",
        date: "2025-06-06",
    },
    {
        id: 4,
        title: "SignalR ilə real-time chat",
        author: "Leyla",
        date: "2025-06-05",
    },
    {
        id: 5,
        title: "Entity Framework Core optimizasiyası",
        author: "Rashad",
        date: "2025-06-04",
    },
];

const RecentPosts = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-full">
            <h3 className="text-xl font-bold mb-4">📝 Son Paylaşımlar</h3>
            <ul>
                {posts.map((post) => (
                    <li
                        key={post.id}
                        className="border-b last:border-b-0 py-3 hover:bg-gray-50 cursor-pointer rounded-md transition"
                    >
                        <h4 className="font-semibold text-blue-600">{post.title}</h4>
                        <p className="text-sm text-gray-600">
                            Müəllif: <span className="font-medium">{post.author}</span> | Tarix:{" "}
                            {new Date(post.date).toLocaleDateString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentPosts;
