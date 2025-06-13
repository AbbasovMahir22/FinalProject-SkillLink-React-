import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaAngleDoubleUp } from "react-icons/fa";
import axios from "axios";
const Layout = ({ children }) => {
    const [open, setOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem("token");
    const [user, setUser] = useState({});
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setOpen(true);
        };
        const getMyData = async () => {
            const res = await axios.get(`${apiUrl}/AdminAccount/ManagementUserInfo`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setRoles(res.data.roles.$values);

            setUser(res.data);
        }
        getMyData();
        handleResize();
        window.addEventListener("resize", handleResize);

        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="flex">
                <Sidebar open={open} setOpen={setOpen} isMobile={isMobile} />

                <div className={`flex flex-col flex-grow transition-all duration-300
                    ${isMobile ? "ml-0" : open ? "ml-64" : "ml-16"}`}>

                    <header className="bg-white shadow p-4 flex justify-between items-center">
                        <div className=" block sm:flex sm:items-center">
                            <img className="ml-6 w-[50px] h-[50px] rounded-full" src={user.imageUrl} />
                            <div className="font-bold ml-6">
                                <h1 className="text-[15px] sm:text-[15px] lg:text-xl ">{user.fullName}/<span className="text-red-500">{roles.join(",")}</span></h1>
                                <span className="text-[14px] text-gray-500">{user.email}</span>
                            </div>
                        </div>
                        <button
                            className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-500"
                            onClick={() => { sessionStorage.removeItem("token"); window.location.href = "http://localhost:5174/login"; }}
                        >
                            Logout
                        </button>
                    </header>

                    <main className="flex-grow p-6 bg-gray-100">
                        {children}
                    </main>

                    <footer className="bg-white shadow p-4 text-center text-gray-600">
                        &copy; 2025 Your Company. All rights reserved.
                    </footer>

                    {showScrollTop && (
                        <button
                            onClick={scrollToTop}
                            className="fixed flex items-center justify-center bottom-6 cursor-pointer right-6 p-3 bg-blue-600 w-[50px] h-[50px] text-white rounded-full  shadow-lg hover:bg-blue-700 transition"
                            aria-label="Scroll to top"
                            title="Scroll to top"
                        >
                            <FaAngleDoubleUp size={25} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Layout;
