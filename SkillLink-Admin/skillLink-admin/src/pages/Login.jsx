import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminLogin() {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const isAdminRole = (token) => {
        try {
            const [, payload] = token.split(".");
            const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
            const roles =
                json.role ??
                json.roles ??
                json["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
                [];
            return (Array.isArray(roles) ? roles : [roles])
                .map((r) => r.toLowerCase())
                .some((r) => r === "admin" || r === "superadmin");
        } catch {
            return false;
        }
    };

    /* submit */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(`${apiUrl}/Account/Login`, form);

            if (!data.success || !isAdminRole(data.token)) {
                toast.error("User not found");
                return;
            }

            sessionStorage.setItem("token", data.token);

            navigate("/");
        } catch {
            toast.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-600 via-sky-500 to-orange-400 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white/20 backdrop-blur-md text-white rounded-2xl shadow-xl p-8 space-y-6"
            >
                <h1 className="text-3xl font-extrabold text-center drop-shadow-sm">
                    Admin <span className="text-orange-300">Login</span>
                </h1>

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full rounded-lg bg-white/80 text-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                />

                <div className="relative">
                    <input
                        type={showPass ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full rounded-lg bg-white/80 text-black px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-700 hover:text-orange-500 transition"
                    >
                        {showPass ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-400 to-sky-400 hover:from-sky-500 hover:to-orange-500 text-black font-bold py-2 rounded-lg transition cursor-pointer"
                >
                    {loading ? <ClipLoader size={20} color="#000" /> : "Login"}
                </button>
            </form>

            <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        </div>
    );
}
