import { FaBars, FaTachometerAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { LogOut, User2Icon, ClipboardList } from "lucide-react";
import { ImWarning } from "react-icons/im";
import { jwtDecode } from "jwt-decode";
const Sidebar = ({ open, setOpen, isMobile }) => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    let isSuperAdmin = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            const roles = decoded.roles || decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            isSuperAdmin = roles && roles.some(role => role.toLowerCase() === "superadmin");
        } catch (error) {
            console.error("Token decoding error:", error);
        }
    }
    const navClass = ({ isActive }) =>
        clsx(
            "flex items-center gap-4 p-4 hover:bg-yellow-500 transition-colors",
            isActive && "bg-red-700 text-white"
        );
    const logout = () => {
        sessionStorage.removeItem("token");
        navigate('/login');
    }
    return (

        <>
            {isMobile && !open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed top-2 left-1 z-50 cursor-pointer p-2 rounded bg-blue-900 text-white shadow-md"
                    aria-label="Open menu"
                >
                    <FaBars size={20} />
                </button>
            )}

            <div
                className={clsx(
                    "fixed top-0 left-0 h-full bg-blue-900 text-white transition-all duration-300 z-40 flex flex-col",
                    isMobile
                        ? open
                            ? "w-64 translate-x-0"
                            : "-translate-x-full"
                        : open
                            ? "w-64"
                            : "w-16"
                )}
            >
                <div className="flex items-center justify-between p-4 border-b border-blue-800">
                    <Link to='/'>
                        <h1 className={clsx("text-xl font-bold", !open && "hidden")}>SkillLink</h1>
                    </Link>
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        className="text-white cursor-pointer hover:text-red-600 focus:outline-none"
                    >
                        {open ? <IoMdClose size={25} /> : <FaBars size={25} />}
                    </button>
                </div>

                <nav className="mt-6 flex flex-col flex-grow">
                    <NavLink
                        to="/"
                        className={navClass}
                        onClick={() => setOpen(false)}
                    >
                        <FaTachometerAlt />
                        {open && <span>Dashboard</span>}
                    </NavLink>
                    <NavLink
                        to="/Category"
                        className={navClass}
                        onClick={() => setOpen(false)}
                    >
                        <BiCategory />
                        {open && <span>Categories</span>}
                    </NavLink>
                    <NavLink
                        to="/SubCategory"
                        className={navClass}
                        onClick={() => setOpen(false)}
                    >
                        <MdCategory />
                        {open && <span>SubCategories</span>}
                    </NavLink>
                    <NavLink
                        to="/Specialization"
                        className={navClass}
                        onClick={() => setOpen(false)}
                    >
                        <GiSkills />
                        {open && <span>Specialization</span>}
                    </NavLink>
                    <NavLink
                        to="/Users"
                        className={navClass}
                        onClick={() => setOpen(false)}
                    >
                        <User2Icon size={18} />
                        {open && <span>Users</span>}
                    </NavLink>
                    <NavLink
                        to={isSuperAdmin ? "/Log" : ""}
                        className={isSuperAdmin ? navClass : "flex text-gray-500 items-center gap-4 p-4 hover:bg-yellow-500 transition-colors"}
                        onClick={() => setOpen(false)}
                    >
                        <ClipboardList size={18} />
                        {open && <span>Logs</span>}
                    </NavLink>
                    <NavLink
                        to="/Report"
                        className={navClass}
                        onClick={() => setOpen(false)}
                    >
                        <ImWarning size={18} />
                        {open && <span>Reports</span>}
                    </NavLink>
                </nav>
                <button
                    className="text-center font-extrabold cursor-pointer flex items-center gap-4 p-4 bg-yellow-600 text-white rounded hover:bg-red-500"
                    onClick={logout}
                >
                    <LogOut />
                    {open && <span> Logout</span>}
                </button>
            </div>

            {isMobile && open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed top-0 inset-0 bg-black opacity-50 z-30"
                ></div>
            )}
        </>
    );
};

export default Sidebar;
