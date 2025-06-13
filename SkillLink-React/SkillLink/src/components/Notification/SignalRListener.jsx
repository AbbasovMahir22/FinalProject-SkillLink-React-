import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { connection } from '../Notification/SignalR';

const SignalRListener = () => {
    const navigate = useNavigate();

    useEffect(() => {
        connection
            .start()
            .then(() => console.log("SignalR connected"))
            .catch((err) => console.error(" SignalR connection error:", err));

        connection.on("BannedOrUnBanned", (isBanned) => {
            if (isBanned) {
                toast.error("You are banned! You are logged out", {
                    duration: 5000,
                    style: {
                        fontSize: "18px",
                        fontWeight: "bold",
                        padding: "16px 24px",
                        borderRadius: "12px",
                        background: "#e53e3e",
                        color: "white",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        maxWidth: "400px",
                        textAlign: "center",
                    }
                });
                setTimeout(() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                }, 5000);
            }
        });

        return () => {
            connection.off("BannedOrUnBanned");
        };
    }, []);

    return null;
};

export default SignalRListener;
