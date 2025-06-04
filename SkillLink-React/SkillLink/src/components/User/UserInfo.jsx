import axios from "axios";
import { useEffect, useState } from "react";

const UserInfo = ({ userInfo }) => {
    const [isFollow, setIsFollow] = useState();


    useEffect(() => {
        setIsFollow(userInfo.follow);
    }, [userInfo.follow])

    const followOrUnFollow = async () => {
        const token = localStorage.getItem("token");
        if (!isFollow) {
            await axios.post(`https://localhost:7067/api/UserFollow/Create/${userInfo.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setIsFollow(!isFollow);

        } else {
            await axios.delete(`https://localhost:7067/api/UserFollow/Delete/${userInfo.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setIsFollow(!isFollow);

        }
    }
    return (
        <div className="bg-amber-50 rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <img
                    src={userInfo.imageUrl}
                    alt={userInfo.fullName}
                    className="w-[45px] h-[45px] sm:w-24 sm:h-24  rounded-full border-4 border-white shadow-md object-cover"
                />
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
                <div className="cursor-pointer hover:text-red-500 transition duration-300">
                    <p className="text-sm text-gray-500">Following</p>
                    <p className="text-xl font-semibold">{userInfo.follwingCount}</p>
                </div>
                <div className="cursor-pointer hover:text-red-500 transition duration-300">
                    <p className="text-sm text-gray-500">Followers</p>
                    <p className="text-xl font-semibold">{userInfo.followerCount}</p>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
