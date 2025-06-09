const TopUsers = () => {
    const topUsers = [
        {
            fullName: "Orxan Məmmədov",
            email: "orxan@example.com",
            image: "",
            postCount: 45,
            followingCount: 120,
            followerCount: 340,
        },
        {
            fullName: "Aysel Həsənova",
            email: "aysel@example.com",
            postCount: 38,
            followingCount: 98,
            followerCount: 290,
        },
        {
            fullName: "Kamran Quliyev",
            email: "kamran@example.com",
            postCount: 30,
            followingCount: 75,
            followerCount: 210,
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
            <h2 className="text-2xl font-semibold text-yellow-600 mb-4"> Top İstifadəçilər</h2>

            <div className="grid gap-6">
                {topUsers.map((user, index) => (
                    <div
                        key={index}
                        className="bg-yellow-50 hover:bg-yellow-100 transition rounded-xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={user.image || `https://ui-avatars.com/api/?name=${user.fullName}`}
                                alt={user.fullName}
                                className="w-16 h-16 rounded-full object-cover border border-yellow-400"
                            />
                            <div>
                                <p className="text-lg font-semibold text-gray-900">{user.fullName}</p>
                                <p className="text-sm text-yellow-700 break-all">{user.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 text-center w-full sm:w-auto text-sm sm:text-xs md:text-sm">
                            <div>
                                <p className="font-semibold text-gray-800">{user.postCount}</p>
                                <p>Post</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{user.followingCount}</p>
                                <p>Following</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{user.followerCount}</p>
                                <p>Followers</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopUsers;
