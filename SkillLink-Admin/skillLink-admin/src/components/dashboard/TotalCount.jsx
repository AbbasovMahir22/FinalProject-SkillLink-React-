import React from 'react'
const stats = [
    { title: "İstifadəçilər", value: 1200, icon: "👥", bg: "bg-blue-500" },
    { title: "Postlar", value: 340, icon: "📝", bg: "bg-green-500" },
    { title: "Bildirişlər", value: 27, icon: "🔔", bg: "bg-yellow-500" },
    { title: "Yeni Qeydiyyatlar", value: 15, icon: "✨", bg: "bg-purple-500" },
];
function TotalCount() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">📊 Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
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

export default TotalCount