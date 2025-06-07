import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import UserListModal from "./UserListModal";


const UserInfo = ({ userInfo }) => {
    const [isFollow, setIsFollow] = useState();
    const token = localStorage.getItem("token");
    const [modalTitle, setModalTitle] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalUsers, setModalUsers] = useState([]);
    const [followCount, setFollowCount] = useState();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        setIsFollow(userInfo.follow);
        setFollowCount(userInfo.followerCount);
    }, [userInfo.follow])

    const followOrUnFollow = async () => {

        if (!isFollow) {
            await axios.post(`${apiUrl}UserFollow/Create/${userInfo.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setIsFollow(!isFollow);
            setFollowCount(prev => prev + 1);

        } else {
            await axios.delete(`${apiUrl}/UserFollow/Delete/${userInfo.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setIsFollow(!isFollow);
            setFollowCount(prev => prev - 1);


        }
    }
    const openUserListModal = async (type) => {
        setModalTitle(type === "following" ? "Following" : "Followers");
        try {
            const res = await axios.get(`${apiUrl}/UserFollow/GetAllByUserId${type === "following" ? "Following" : "Follower"}/${userInfo.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setModalUsers(res.data.$values || []);
            setShowModal(true);
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
        }
    };
    return (
        <div className="bg-amber-50 rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
                {userInfo.imageUrl ? (
                    <img
                        src={userInfo.imageUrl}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-md "
                    />

                ) : (
                    <FaUserCircle className="cursor-pointer w-24 h-24" />
                )}
                <div className="sm:text-start  md:text-left">
                    <div className=" sm:block md:block lg:flex gap-3   items-start">
                        <div>
                            <h2 className="text-[12px] sm:text-[18px] md:text-[15px] lg:text-2xl  font-bold text-gray-800 ">{userInfo.fullName}</h2>

                            <p className="text-gray-600 text-[13px] sm:text-[15px]">{userInfo.specialization}</p>
                        </div>
                        {isFollow ? (

                            <button onClick={followOrUnFollow} className="text-white mt-1.5 w-auto md;w-[100px] transiation duration-300 bg-red-600 hover:bg-red-500 px-3 text-[12px] md:text-[15px]  rounded-lg cursor-pointer">Unfollow</button>
                        ) : (

                            <button onClick={followOrUnFollow} className="text-white w-auto md:w-[100px] text-[12px] md:text-[20px] transiation duration-300 bg-blue-600 hover:bg-blue-500 px-3  rounded-lg cursor-pointer">Follow</button>
                        )}
                    </div>

                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center w-full md:w-auto">
                <div>
                    <p className="text-sm text-gray-500">Posts</p>
                    <p className="text-xl font-semibold text-gray-800">{userInfo.postCount}</p>
                </div>
                <button onClick={() => openUserListModal("following")} className="cursor-pointer hover:text-red-500 transition duration-300">
                    <p className="text-sm text-gray-500">Following</p>
                    <p className="text-xl font-semibold">{userInfo.follwingCount}</p>
                </button>
                <button onClick={() => openUserListModal("follower")} className="cursor-pointer hover:text-red-500 transition duration-300">
                    <p className="text-sm text-gray-500">Followers</p>
                    <p className="text-xl font-semibold">{followCount}</p>
                </button>
            </div>
            {showModal && (
                <UserListModal
                    title={modalTitle}
                    users={modalUsers}
                    onClose={() => setShowModal(false)}
                    onUserClick={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default UserInfo;
