import { FaBars, FaTachometerAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BiCategory } from "react-icons/bi";
import { Link } from "react-router-dom";
import { MdCategory } from "react-icons/md";
import { GiSkills } from "react-icons/gi";
import clsx from "clsx";

const Sidebar = ({ open, setOpen, isMobile }) => {
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
                    <h1 className={clsx("text-xl font-bold", !open && "hidden")}>SkillLink</h1>
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        className="text-white cursor-pointer hover:text-red-600 focus:outline-none"
                    >
                        {open ? <IoMdClose size={25} /> : <FaBars size={25} />}
                    </button>
                </div>

                <nav className="mt-6 flex flex-col flex-grow">
                    <Link
                        to="/"
                        className="flex items-center gap-4 p-4 hover:bg-blue-800"
                        onClick={() => setOpen(false)}
                    >
                        <FaTachometerAlt />
                        {open && <span>Dashboard</span>}
                    </Link>
                    <Link
                        to="/Category"
                        className="flex items-center gap-4 p-4 hover:bg-blue-800"
                        onClick={() => setOpen(false)}
                    >
                        <BiCategory />
                        {open && <span>Categories</span>}
                    </Link>
                    <Link
                        to="/SubCategory"
                        className="flex items-center gap-4 p-4 hover:bg-blue-800"
                        onClick={() => setOpen(false)}
                    >
                        <MdCategory />
                        {open && <span>SubCategories</span>}
                    </Link>
                    <Link
                        to="/Specialization"
                        className="flex items-center gap-4 p-4 hover:bg-blue-800"
                        onClick={() => setOpen(false)}
                    >
                        <GiSkills />
                        {open && <span>Specialization</span>}
                    </Link>
                </nav>


            </div>

            {/* Overlay */}
            {isMobile && open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black opacity-50 z-30"
                ></div>
            )}
        </>
    );
};

export default Sidebar;
