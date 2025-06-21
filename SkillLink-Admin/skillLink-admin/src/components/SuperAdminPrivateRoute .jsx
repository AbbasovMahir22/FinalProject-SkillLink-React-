import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SuperAdminPrivateRoute = ({ children }) => {
    const [checking, setChecking] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            const decoded = jwtDecode(token);

            const now = Date.now() / 1000;
            if (decoded.exp && decoded.exp < now) {
                navigate("/unauthorized", { replace: true });
                return;
            }

            const rawRoles =
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                decoded.roles ||
                decoded.role;

            const roles = (Array.isArray(rawRoles) ? rawRoles : [rawRoles])
                .filter(Boolean)
                .map(role => role.toLowerCase());

            const isSuperAdmin = roles.includes("superadmin");

            if (isSuperAdmin) {
                setChecking(false);
            } else {
                navigate("/forbidden", { replace: true });
            }
        } catch (err) {
            console.error("Token decoding xetasi:", err);
            navigate("/unauthorized", { replace: true });
        }
    }, [navigate]);

    if (checking) {
        return <div className="text-center mt-10 text-gray-500">Checking...</div>;
    }

    return children;
};

export default SuperAdminPrivateRoute;
