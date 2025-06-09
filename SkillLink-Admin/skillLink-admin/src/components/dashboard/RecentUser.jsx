const RecentUsers = () => {
    const mockUsers = [
        {
            fullName: "Aysel Həsənova",
            email: "aysel@example.com",
            createdAt: "2025-06-08T10:00:00Z",
            avatar: "",
        },
        {
            fullName: "Orxan Məmmədov",
            email: "orxan@example.com",
            createdAt: "2025-06-08T09:30:00Z",
        },
        {
            fullName: "Leyla Əliyeva",
            email: "leyla@example.com",
            createdAt: "2025-06-07T16:00:00Z",
        },
        {
            fullName: "Kamran Quliyev",
            email: "kamran@example.com",
            createdAt: "2025-06-07T13:20:00Z",
        },
        {
            fullName: "Nigar Vəliyeva",
            email: "nigar@example.com",
            createdAt: "2025-06-06T11:50:00Z",
        },
        {
            fullName: "Mahir Abbasov",
            email: "mahir@example.com",
            createdAt: "2025-06-06T11:50:00Z",
        },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-full sm:max-w-md md:max-w-full xl:max-w-full">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4"> Yeni Qeydiyyatdan Keçənlər</h2>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {mockUsers.map((user, index) => (
                    <div
                        key={index}
                        className="bg-gray-50 hover:bg-blue-50 transition rounded-xl shadow-sm p-4 flex items-center gap-4"
                    >
                        <img
                            src={user.avatar || "https://ui-avatars.com/api/?name=" + user.fullName}
                            alt="avatar"
                            className="w-14 h-14 rounded-full object-cover border border-blue-300"
                        />
                        <div className="flex flex-col justify-between">
                            <span className="font-semibold text-gray-900">{user.fullName}</span>
                            <a
                                href={`mailto:${user.email}`}
                                className="text-sm text-blue-600 hover:underline break-all"
                            >
                                {user.email}
                            </a>
                            <span className="text-xs text-gray-500">
                                Qeydiyyat: {new Date(user.createdAt).toLocaleDateString("az-Latn-AZ")}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default RecentUsers;
