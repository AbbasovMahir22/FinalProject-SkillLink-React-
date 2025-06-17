// PrivateRoute.jsx
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    if (!token) {
        useEffect(() => {
            navigate("/login", { replace: true });
        }, []);

        return null;
    }


    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
            return <Navigate to="/login" replace />;
        }

        const roleClaim =
            decoded.role ??
            decoded.roles ??
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        const roles = (Array.isArray(roleClaim) ? roleClaim : [roleClaim])
            .filter(Boolean)
            .map((r) => r.toLowerCase());


        return roles.includes("member") ? children : <Navigate to="/unauthorized" replace />;
    } catch (err) {
        console.error("JWT dwcode xetasi:", err);
        return <Navigate to="/unauthorized" replace />;
    }
};

export default PrivateRoute;
