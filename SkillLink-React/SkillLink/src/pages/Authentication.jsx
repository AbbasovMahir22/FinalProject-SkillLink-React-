import { useState } from 'react';
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
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const changeForm = () => {
        setIsLogin(!isLogin);
        setIsForgotPassword(false);
        setMessage("");
        setForm({ FullName: '', UserName: '', email: '', password: '', confirmPassword: '' });
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${apiUrl}/Account/ForgotPassword`, { email: forgotEmail });
            Swal.fire("Success", "If the email exists, a reset link has been sent.", "success");
            setForgotEmail("");
            setIsForgotPassword(false);
        } catch (error) {
            Swal.fire("Error", "Something went wrong. Please try again later.", "error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            if (isLogin) {
                const res = await axios.post(`${apiUrl}/Account/Login`, {
                    email: form.email,
                    password: form.password,
                });

                if (res.data.success) {
                    localStorage.setItem('token', res.data.token);
                    if (!res.data.hasSpecialization) {
                        setShowModal(true);
                        setLoading(false);
                    }
                    else {
                        navigate('/');
                        setLoading(false);
                    }
                } else {
                    toast.error(res.data.errorMessage);
                    setLoading(false);
                }
            } else {
                if (form.password !== form.confirmPassword) {
                    setMessage("Confirm password is wrong");
                    return;
                }

                const { confirmPassword, ...registerData } = form;
                setLoading(true)
                const res = await axios.post(`${apiUrl}https://localhost:7067/api/Account/Register`, registerData);
                setLoading(false)
                if (res.data) {
                    setForm({ FullName: '', UserName: '', email: '', password: '', confirmPassword: '' });
                    setIsLogin(true);
                    toast.success("Registration completed successfully.");
                } else {
                    setMessage(res.data || "Error");
                }
            }
        } catch (err) {
            const errorData = err.response?.data;
            setLoading(false);
            if (Array.isArray(errorData)) {
                if (errorData.length > 0) {
                    toast.error(errorData[0]);
                    console.log(errorData[0]);
                }
            } else if (typeof errorData === "string") {
                toast.error(errorData);
                console.log(errorData);
            } else {
                toast.error("Something went wrong.");
            }
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-600  to-orange-400 text-white"
 >
            <SpecializationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSaved={() => {
                    setShowModal(false);
                    navigate('/');
                }}
            />
            <div className="opacity-90 border bg-cyan-900  backdrop-blur-md  scale-110  rounded-xl p-8 w-full max-w-md">
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
                                        required
                                        autoComplete="off"
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
                                required
                                autoComplete="off"
                            />

                            <div className="relative">
                                <input
                                    type={showPasswords ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="input w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                    autoComplete="off"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="absolute right-3 cursor-pointer hover:text-red-600 duration-300 top-2.5 text-gray-200"
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
                                    className="input w-full px-4 py-2 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-orange-400"
                                    required
                                    autoComplete="off"
                                />
                            )}

                            {message && <p className='text-center text-red-600 font-medium'>{message}</p>}

                            <button
                                type="submit"
                                className="w-full text-[20px] font-bold bg-gradient-to-r from-orange-400 to-sky-400 cursor-pointer text-black py-2 rounded-md hover:from-sky-500 hover:to-orange-500 hover:text-white transition"
                            >
                                {loading ? <ClipLoader size={20} color="#fff" /> : isLogin ? 'Login' : 'Register'}


                            </button>
                        </form>

                        {isLogin && (
                            <p className="text-left  text-sm mt-2 ">
                                <button
                                    onClick={() => setIsForgotPassword(true)}
                                    className="text-white cursor-pointer font-semibold hover:underline"
                                >
                                    Forgot Password?

                                </button>
                            </p>
                        )}

                        <p className="text-center text-white mt-4">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <button
                                onClick={changeForm}
                                className="text-blue-600 cursor-pointer hover:underline font-semibold"
                            >
                                {isLogin ? 'Register' : 'Login'}
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-6 text-white">
                            Reset Your Password
                        </h2>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <input
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                required
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="w-full text-[20px] font-bold bg-gradient-to-r from-orange-400 to-sky-400  py-2 rounded-md text-white cursor-pointer hover:from-sky-500 hover:to-orange-500 hover:text-white transition"
                            >
                                Send Email
                            </button>
                        </form>
                        <p className="text-center mt-4">
                            <button
                                onClick={() => setIsForgotPassword(false)}
                                className="text-white cursor-pointer font-semibold hover:underline"
                            >
                                Back to Login
                            </button>
                        </p>
                    </>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Authentication;
