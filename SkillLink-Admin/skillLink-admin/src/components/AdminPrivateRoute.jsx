import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminPrivateRoute = ({ children }) => {
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

            const roleClaim =
                decoded.role ??
                decoded.roles ??
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            const roles = (Array.isArray(roleClaim) ? roleClaim : [roleClaim])
                .filter(Boolean)
                .map(r => r.toLowerCase());

            const allowed = ["admin", "superadmin"];

            if (roles.some(r => allowed.includes(r))) {
                setChecking(false);
                return;
            }

            navigate("/forbidden", { replace: true });
        } catch (err) {
            console.error("Token decode xetasi:", err);
            navigate("/unauthorized", { replace: true });
        }
    }, [navigate]);

    if (checking) return <div className="text-center mt-10">Yoxlanilir...</div>;

    return children;
};

export default AdminPrivateRoute;
