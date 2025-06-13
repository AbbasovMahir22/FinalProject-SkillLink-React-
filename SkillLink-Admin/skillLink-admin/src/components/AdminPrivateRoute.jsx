import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminPrivateRoute = ({ children }) => {
    const [authorized, setAuthorized] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            setAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp && decoded.exp < currentTime) {
                setAuthorized(false);
                return;
            }

            const roleClaim =
                decoded.role ||
                decoded.roles ||
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];

            if (roles.includes("Admin") || roles.includes("SuperAdmin")) {
                setAuthorized(true);
            } else {
                setAuthorized(false);
            }
        } catch {
            setAuthorized(false);
        }
    }, []);

    useEffect(() => {
        if (authorized === false) {
            const token = sessionStorage.getItem("token");

            if (!token) {
                window.location.href = "http://localhost:5174/login";
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const roleClaim =
                    decoded.role ||
                    decoded.roles ||
                    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];

                if (roles.includes("Member")) {
                    window.location.href = "http://localhost:5174/";
                } else {
                    window.location.href = "http://localhost:5173/";
                }
            } catch {
                window.location.href = "http://localhost:5174/login";
            }
        }
    }, [authorized, navigate]);

    if (authorized === null) {
        return <div className="text-center mt-10">Yoxlanilir...</div>;
    }

    if (!authorized) {
        return null;
    }

    return children;
};

export default AdminPrivateRoute;
