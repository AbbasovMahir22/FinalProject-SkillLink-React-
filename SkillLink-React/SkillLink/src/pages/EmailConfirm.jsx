import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ConfirmEmail() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Redirecting...");
    const [status, setStatus] = useState("loading");
    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const userId = searchParams.get("userId");
        const token = searchParams.get("token");
        console.log("UserId:", userId);
        console.log("Token:", token);
        if (userId && token) {
            axios
                .get(`${apiUrl}/account/ConfirmEmail`, {
                    params: { userId, token },
                })
                .then(() => {
                    setMessage("Your email has been successfully confirmed!");
                    setStatus("success");
                })
                .catch(() => {
                    setMessage("Email confirmation failed. Please try again.");
                    setStatus("error");
                });
        } else {
            setMessage("Invalid confirmation data.");
            setStatus("error");
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
            <div className={`p-8 rounded-2xl shadow-xl w-full max-w-md text-center transition-all duration-300
                ${status === "success" ? "bg-green-100 text-green-800 border border-green-300" :
                    status === "error" ? "bg-red-100 text-red-800 border border-red-300" :
                        "bg-yellow-100 text-yellow-800 border border-yellow-300"}
            `}>
                <h1 className="text-2xl font-bold mb-4">
                    {status === "success" && " Success"}
                    {status === "error" && " Error"}
                    {status === "loading" && " Please wait"}
                </h1>
                <p className="text-lg">{message}</p>
            </div>
        </div>
    );
}
