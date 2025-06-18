import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { connection } from '../Notification/SignalR';

const SignalRListener = () => {
    const navigate = useNavigate();
    const [replace, setReplace] = useState(1);
    useEffect(() => {
        connection
            .start()
            .then(() => console.log("SignalR connected"))

        connection.on("BannedOrUnBanned", (message) => {
            if (message.isBanned) {
                localStorage.removeItem("token");
                toast.error(`You are banned! You are unbanned in ${message.time} minutes`, {
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
                    navigate("/login");
                }, 5000)

            }
        });
        setReplace(3);


        return () => {
            connection.off("BannedOrUnBanned");
        };
    }, [replace]);

    return null;
};

export default SignalRListener;
