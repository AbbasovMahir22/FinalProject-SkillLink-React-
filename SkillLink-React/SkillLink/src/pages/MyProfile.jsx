import { useEffect, useRef, useState } from "react";
import { Camera, XCircle, CheckCircle } from "lucide-react";
import { BiSolidMessageEdit } from "react-icons/bi";
import Loader from "../components/Loader";
import axios from "axios";
import PostCard from "../components/Posts/PostCard";

const MyProfile = () => {
    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editableName, setEditableName] = useState("");
    const [editableSpecialization, setEditableSpecialization] = useState("");
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const token = localStorage.getItem("token");
    const fileInputRef = useRef(null);

    const getAllSpecialization = async () => {
        const res = await axios.get("https://localhost:7067/api/Specialization/GetAll", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setSpecializations(res.data.$values);
    };

    const getAllMyPosts = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const res = await axios.get("https://localhost:7067/api/Post/GetMyPosts", {
                headers: { Authorization: `Bearer ${token}` },
                params: { page }
            });
            const newPosts = res.data.posts?.$values || [];
            setPosts(prev => [...prev, ...newPosts]);
            setHasMore(newPosts.length > 0);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const myInfo = async () => {
            const res = await axios.get("https://localhost:7067/api/Account/GetMyInfo", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUser(res.data)
        }
        myInfo();
        getAllMyPosts();

    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
            if (bottom && hasMore && !loading) {
                getAllMyPosts();
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);

    const toggleEdit = async () => {
        setEditMode(!editMode);
        await getAllSpecialization();
        if (!editMode && user) {
            setEditableName(user.fullName);
            const matched = specializations.find(s => s.name === user.specialzation);
            setEditableSpecialization(matched?.id?.toString() || "");
        }
        setEditMode(!editMode);
    };

    const cancelEdit = () => setEditMode(false);

    const saveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append("fullName", editableName);
            formData.append("specializationId", editableSpecialization);

            if (fileInputRef.current && fileInputRef.current.files[0]) {
                formData.append("imageFile", fileInputRef.current.files[0]);
            }

            await axios.put("https://localhost:7067/api/Account/UpdateProfile", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            const specializationName = specializations.find(s => s.id.toString() === editableSpecialization)?.name || "";
            setUser(prev => ({
                ...prev,
                fullName: editableName,
                specialzation: specializationName,
                imageUrl: fileInputRef.current?.files[0]
                    ? URL.createObjectURL(fileInputRef.current.files[0])
                    : prev.imageUrl,
            }));

            setEditMode(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };


    const triggerFileInput = () => fileInputRef.current?.click();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUser(prev => ({ ...prev, imageUrl }));
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 select-none">
            {loading && <Loader />}
            <div className="bg-white rounded-2xl shadow p-6 relative flex flex-col md:flex-row items-center gap-6">
                {!editMode ? (
                    <BiSolidMessageEdit
                        onClick={toggleEdit}
                        size={22}
                        className="absolute top-3 right-3 text-blue-500 cursor-pointer hover:text-red-500 transition"
                        title="Edit Mode"
                    />
                ) : (
                    <XCircle size={21} onClick={cancelEdit} className="absolute top-2.5 right-3 text-blue-500 cursor-pointer hover:text-red-500 transition" />
                )}
                {editMode && (
                    <button onClick={saveChanges} className="absolute top-2.5 right-10">
                        <CheckCircle className="text-green-600 cursor-pointer hover:text-green-800" size={20} />
                    </button>
                )}

                <div className="relative group w-24 h-24">
                    <img
                        src={user.imageUrl}
                        alt="Profil şəkli"
                        className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                    />
                    {editMode && (
                        <>
                            <div
                                onClick={triggerFileInput}
                                className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px] bg-opacity-30 rounded-full transition-opacity duration-300 cursor-pointer hover:bg-opacity-50"
                            >
                                <Camera className="text-white transiation duration-300 hover:text-red-800 hover:size-10 " size={35} />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </>
                    )}
                </div>

                <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                        {editMode ? (
                            <input
                                type="text"
                                className="border rounded px-2 py-1 text-gray-800"
                                value={editableName}
                                onChange={(e) => setEditableName(e.target.value)}
                            />
                        ) : (
                            <h2 className="text-xl font-bold text-gray-800">{user.fullName}</h2>
                        )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                        {editMode ? (
                            <select
                                className="border rounded px-2 py-1 text-gray-800"
                                value={editableSpecialization}
                                onChange={(e) => setEditableSpecialization(e.target.value)}
                            >
                                <option value="">Choose</option>
                                {specializations.map(spec => (
                                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-gray-600">{user.specialzation}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center mt-8">
                <div className="bg-gray-100 rounded-xl py-4">
                    <p className="text-sm text-gray-500">Posts</p>
                    <p className="text-xl font-semibold text-gray-800">{user.postCount}</p>
                </div>
                <div className="bg-gray-100 rounded-xl py-4">
                    <p className="text-sm text-gray-500">Following</p>
                    <p className="text-xl font-semibold text-gray-800">{user.followingCount}</p>
                </div>
                <div className="bg-gray-100 rounded-xl py-4">
                    <p className="text-sm text-gray-500">Follower</p>
                    <p className="text-xl font-semibold text-gray-800">{user.followerCount}</p>
                </div>
            </div>

            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4">Posts</h3>
                <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                    {posts.map((post, i) => (
                        <PostCard key={i} post={post} isMyProfile={true} />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default MyProfile;
