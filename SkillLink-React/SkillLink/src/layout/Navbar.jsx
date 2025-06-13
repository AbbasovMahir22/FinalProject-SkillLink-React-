import { FaUserCircle, FaCog, FaHome, FaBars, FaTimes, FaSignOutAlt, FaEnvelope, FaBell, FaCompass, } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { stopConnection } from "../signalR";
import Swal from "sweetalert2";
import axios from "axios";
import logo from "../assets/Images/SkillLink.png";
import { useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL;


    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleProfile = () => setProfileOpen(!profileOpen);

    useEffect(() => {
        const getUserInf = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const userInfo = await axios.get(
                    `${apiUrl}/Account/GetUserInfo`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }

                );
                setUser(userInfo.data);

            } catch (error) {
                console.error(error);
            }
        };
        getUserInf();

        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const logout = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to make a speech?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                stopConnection();
                navigate("/login");
            }
        });
    };

    return (
        <nav
            className="bg-yellow-100 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-blue-600 flex items-center">
                    <div className="w-[130px] h-[60px] ">
                        <img src={logo} className="w-full h-full object-cover rounded mt-0.5" />
                    </div>

                </Link>

                <div className="hidden lg:flex items-center gap-10 text-gray-700 font-medium tracking-wide">
                    <Link
                        to="/"
                        className={`flex items-center gap-2 ${currentPath === "/" ? "text-blue-600 font-bold" : "text-gray-700"
                            } hover:text-blue-600`}
                        title="Home"
                    >
                        <FaHome className="text-3xl" />
                        <span className="text-lg">Home</span>
                    </Link>
                    <Link
                        to="/explore"
                        className={`flex items-center gap-2 ${currentPath === "/explore" ? "text-cyan-600 font-bold" : "text-gray-700"
                            } hover:text-blue-600`}
                        title="Explore"
                    >
                        <FaCompass className="text-3xl" />
                        <span className="text-lg">Explore</span>
                    </Link>
                    <Link
                        to="/messages"
                        className={`flex items-center gap-2 ${currentPath === "/messages" ? "text-green-600 font-bold" : "text-gray-700"
                            } hover:text-blue-600`}
                        title="Messages"
                    >
                        <FaEnvelope className="text-3xl" />
                        <span className="text-lg">Messages</span>
                    </Link>
                    <Link
                        to="/notifications"
                        className={`flex items-center gap-2 ${currentPath === "/notifications" ? "text-yellow-600 font-bold" : "text-gray-700"
                            } hover:text-blue-600`}
                        title="Notifications"
                    >
                        <FaBell className="text-3xl" />
                        <span className="text-lg">Notifications</span>
                    </Link>
                </div>

                <div className="hidden lg:flex items-center gap-6 relative min-w-0">
                    <div className="text-sm text-gray-500 text-right truncate max-w-[150px]">
                        <div className="text-gray-800 font-bold truncate">{user.fullName}</div>
                        <div className="text-xs truncate">{user.email}</div>
                    </div>

                    <button onClick={toggleProfile} className="relative flex-shrink-0" title="Profile">
                        {user.imageUrl ? (
                            <img
                                src={user.imageUrl}
                                alt="Profile"
                                className="w-[46px] h-[46px] rounded-full object-cover border border-gray-300 shadow-md cursor-pointer"
                            />
                        ) : (
                            <FaUserCircle className="cursor-pointer w-[46px] h-[46px]" />
                        )}
                    </button>

                    {profileOpen && (
                        <div
                            ref={profileRef}
                            className="absolute right-0 top-14 bg-white border rounded shadow-md w-48 z-50"
                        >
                            <Link
                                onClick={() => setProfileOpen(false)}
                                to="myProfile"
                                className=" px-1 py-2 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
                            >
                                {user.imageUrl ? (
                                    <img
                                        src={user.imageUrl}
                                        alt="Profile"
                                        className="w-[46px] h-[46px] rounded-full object-cover border border-gray-300 shadow-md cursor-pointer"
                                    />
                                ) : (
                                    <FaUserCircle className="cursor-pointer w-[46px] h-[46px]" />
                                )}
                                My Profile
                            </Link>
                            <Link onClick={() => setProfileOpen(false)}
                                to="/settings"
                                className="flex gap-2 px-1 py-2 text-gray-700 hover:bg-gray-200"
                            >
                                <FaCog className="text-blue-600 text-2xl" />
                                Settings
                            </Link>
                            <button
                                onClick={logout}
                                className="w-full cursor-pointer text-left px-4 py-2 bg-red-600 text-black font-bold hover:bg-red-500 flex items-center gap-2"
                            >
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:hidden">
                    <button onClick={toggleMenu}>
                        {menuOpen ? (
                            <FaTimes className="text-4xl cursor-pointer text-gray-700" />
                        ) : (
                            <FaBars className="text-4xl cursor-pointer text-gray-700" />
                        )}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="lg:hidden bg-yellow-50 px-4 pb-4 space-y-4 rounded-b shadow-lg">
                    <Link onClick={() => setMenuOpen(false)} to="/" className="flex items-center gap-3 text-gray-700 transition-all duration-300 hover:text-2xl hover:text-blue-600  text-lg font-semibold">
                        <FaHome className="text-blue-600 text-2xl" />
                        Home
                    </Link>
                    <Link onClick={() => setMenuOpen(false)} to="/explore" className="flex transition-all duration-300 hover:text-2xl  items-center gap-3 text-gray-700 hover:text-blue-600 text-lg font-semibold">
                        <FaCompass className="text-blue-600 text-2xl" />
                        Explore
                    </Link>
                    <Link onClick={() => setMenuOpen(false)} to="/messages" className="flex transition-all duration-300 hover:text-2xl  items-center gap-3 text-gray-700 hover:text-blue-600 text-lg font-semibold">
                        <FaEnvelope className="text-blue-600 text-2xl" />
                        Messages
                    </Link>
                    <Link onClick={() => setMenuOpen(false)} to="/notifications" className="flex transition-all duration-300 hover:text-2xl  items-center gap-3 text-gray-700 hover:text-blue-600 text-lg font-semibold">
                        <FaBell className="text-blue-600 text-2xl" />
                        Notifications
                    </Link>

                    <Link onClick={() => setMenuOpen(false)} to="/myprofile" className="text-gray-700 transition-all duration-300 hover:text-2xl  font-semibold hover:text-blue-600 flex items-center gap-2">
                        <FaUserCircle className="text-blue-600 text-2xl" />
                        My Profile
                    </Link>
                    <Link onClick={() => setMenuOpen(false)} to="/settings" className="text-gray-700 transition-all duration-300 hover:text-2xl  font-semibold hover:text-blue-600 flex items-center gap-2">
                        <FaCog className="text-blue-600 text-2xl" />
                        Settings
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full cursor-pointer transition-all duration-300 hover:translate-x-2.5   text-left px-4 py-2 text-gray-700 font-bold hover:bg-amber-100 flex items-center gap-2"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
