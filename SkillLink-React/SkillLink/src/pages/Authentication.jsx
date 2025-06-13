import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import SpecializationModal from '../components/Auth/SpecializationModal';

function Authentication() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        FullName: '',
        UserName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [forgotEmail, setForgotEmail] = useState("");
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    useEffect(() => {
        localStorage.removeItem("token");
    }, [])
    const changeForm = () => {
        setIsLogin(!isLogin);
        setIsForgotPassword(false);
        setMessage("");
        setForm({
            FullName: '',
            UserName: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/Account/ForgotPassword`, { email: forgotEmail });
            Swal.fire("Success", "If the email exists, a reset link has been sent.", "success");
            setForgotEmail("");
            setIsForgotPassword(false);
        } catch {
            Swal.fire("Error", "Something went wrong. Please try again later.", "error");
        }
    };

    const decodeToken = (token) => {
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`
            ).join(''));
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    };

    const getRolesFromToken = (payload) => {
        if (!payload) return [];

        const possibleRoleClaims = [
            "role",
            "roles",
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

        for (const claimName of possibleRoleClaims) {
            if (payload[claimName]) {
                return Array.isArray(payload[claimName])
                    ? payload[claimName]
                    : [payload[claimName]];
            }
        }

        return [];
    };

    const redirectUser = (token, hasSpecialization) => {
        const payload = decodeToken(token);
        const roles = getRolesFromToken(payload);

        const isOnlyMember = roles.length === 1 && roles[0] === "Member";
        const isAdminOrOther = roles.includes("Admin") || roles.includes("SuperAdmin");

        if (!hasSpecialization && isOnlyMember) {
            setShowModal(true);
            return;
        }

        if (isAdminOrOther) {
            window.location.href = `http://localhost:5173?token=${token}`;
        } else {
            navigate("/");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (isLogin) {
                const { data } = await axios.post(`${apiUrl}/Account/Login`, {
                    email: form.email,
                    password: form.password
                });

                if (!data.success) {
                    toast.error(data.errorMessage || "Login failed");
                    setLoading(false);
                    return;
                }

                const { token, hasSpecialization } = data;
                localStorage.setItem('token', token);

                redirectUser(token, hasSpecialization);

                setLoading(false);
            } else {
                if (form.password !== form.confirmPassword) {
                    setMessage("Confirm password is wrong");
                    setLoading(false);
                    return;
                }

                const { confirmPassword, ...registerData } = form;
                await axios.post(`${apiUrl}/Account/Register`, registerData);

                toast.success("Registration completed successfully.");
                setForm({ FullName: '', UserName: '', email: '', password: '', confirmPassword: '' });
                setIsLogin(true);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            const errorData = err.response?.data;
            if (Array.isArray(errorData)) {
                toast.error(errorData[0]);
            } else if (typeof errorData === "string") {
                toast.error(errorData);
            } else {
                toast.error("Something went wrong.");
            }
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-600 to-orange-400 text-white">

            <SpecializationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSaved={() => {
                    setShowModal(false);
                    navigate('/');
                }}
            />
            <div className="opacity-90 border bg-cyan-900 backdrop-blur-md rounded-xl p-6 sm:p-8 w-full max-w-md mx-4 sm:scale-110">

                <h1 className='text-center text-4xl font-bold mb-2.5'>
                    <span className="text-sky-500">Skill</span>
                    <span className="text-orange-500">Link</span>
                </h1>

                {!isForgotPassword ? (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-6 text-blue-400">
                            {isLogin ? 'Login to Your Account' : 'Create a New Account'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className='flex gap-4 flex-col sm:flex-row sm:gap-0.5'>
                                    <input
                                        type="text"
                                        name="FullName"
                                        value={form.FullName}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        autoComplete="off"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="UserName"
                                        value={form.UserName}
                                        onChange={handleChange}
                                        placeholder="User Name"
                                        className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            )}

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                autoComplete="off"
                                required
                            />

                            <div className="relative">
                                <input
                                    type={showPasswords ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="input w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    autoComplete="off"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="absolute right-3 top-2.5 cursor-pointer text-gray-200 cursor-pointer hover:text-red-600"
                                >
                                    {showPasswords ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>

                            {!isLogin && (
                                <input
                                    type={showPasswords ? "text" : "password"}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-400"
                                    autoComplete="off"
                                    required
                                />
                            )}

                            {message && <p className='text-center text-red-600 font-medium'>{message}</p>}

                            <button
                                type="submit"
                                className="w-full text-[20px] cursor-pointer font-bold bg-gradient-to-r from-orange-400 to-sky-400 text-black py-2 rounded-md hover:from-sky-500 hover:to-orange-500 hover:text-white transition"
                            >
                                {loading ? <ClipLoader size={20} color="#fff" /> : isLogin ? 'Login' : 'Register'}
                            </button>
                        </form>

                        {isLogin && (
                            <p className="text-left text-sm mt-2">
                                <button
                                    onClick={() => setIsForgotPassword(true)}
                                    className="text-white cursor-pointer font-semibold hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </p>
                        )}

                        <p className="text-center mt-4">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <button
                                onClick={changeForm}
                                className="text-white cursor-pointer font-semibold hover:underline"
                            >
                                {isLogin ? "Register" : "Login"}
                            </button>
                        </p>
                    </>
                ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <input
                            type="email"
                            name="forgotEmail"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="Email"
                            className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-400"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r cursor-pointer from-orange-400 to-sky-400 text-black py-2 rounded-md font-bold text-[20px]"
                        >
                            Send Reset Link
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsForgotPassword(false)}
                            className="w-full text-center cursor-pointer underline mt-2"
                        >
                            Back to Login
                        </button>
                    </form>
                )}

            </div>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

        </div>
    );
}

export default Authentication;
