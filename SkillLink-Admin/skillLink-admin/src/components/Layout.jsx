import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
    const [open, setOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setOpen(true);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar open={open} setOpen={setOpen} isMobile={isMobile} />

            <main
                className={`transition-all duration-300 p-6 ${isMobile
                    ? "ml-0"
                    : open
                        ? "ml-64" // sidebar açıq
                        : "ml-16" // sidebar bağlanıb
                    }`}
            >
                {children}
            </main>
        </div>
    );
};

export default Layout;
