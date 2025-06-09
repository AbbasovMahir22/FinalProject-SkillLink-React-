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

        if (userId && token) {
            axios
                .get(`${apiUrl}/account/ConfirmEmail`, {
                    params: { userId, token },
                })
                .then(() => {
                    setMessage("Your email has been successfully confirmed!");
                    setStatus("success");
                    // 3 saniyə sonra login səhifəsinə yönləndir
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 3000);
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

    const renderIcon = () => {
        if (status === "success")
            return (
                <svg
                    className="w-12 h-12 mx-auto mb-4 text-green-600 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            );
        if (status === "error")
            return (
                <svg
                    className="w-12 h-12 mx-auto mb-4 text-red-600 animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            );
        return (
            <svg
                className="w-12 h-12 mx-auto mb-4 text-yellow-500 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                />
            </svg>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-200 p-4">
            <div
                className={`p-8 rounded-3xl shadow-2xl max-w-md w-full text-center transition-all duration-500
          ${status === "success"
                        ? "bg-green-100 text-green-900 border border-green-300"
                        : status === "error"
                            ? "bg-red-100 text-red-900 border border-red-300"
                            : "bg-yellow-100 text-yellow-900 border border-yellow-300"
                    }`}
            >
                {renderIcon()}
                <h1 className="text-3xl font-extrabold mb-4">
                    {status === "success" && "Success"}
                    {status === "error" && "Error"}
                    {status === "loading" && "Please wait..."}
                </h1>
                <p className="text-lg mb-6">{message}</p>

                {status !== "loading" && (
                    <button
                        onClick={() => (window.location.href = "/login")}
                        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition duration-300"
                    >
                        Go to Login
                    </button>
                )}
                {status === "loading" && (
                    <p className="text-sm italic text-yellow-700">Redirecting automatically...</p>
                )}
            </div>
        </div>
    );
}
