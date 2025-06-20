import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import ClipLoader from 'react-spinners/ClipLoader';

function ResetPassword() {
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const emailParam = queryParams.get('email');
        const tokenParam = queryParams.get('token');
        if (emailParam && tokenParam) {
            setEmail(emailParam);
            setToken(tokenParam);
        } else {
            toast.error("Invalid reset link.");
            navigate('/');
        }
    }, [location]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${apiUrl}/Account/ResetPassword`, {
                email,
                token,
                newPassword: form.password
            });

            toast.success("Password has been reset.");
            navigate('/Login');
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-orange-400 text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-white relative text-black p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="New Password"
                        onChange={handleChange}
                        value={form.password}
                        required
                        className="input w-full px-4 py-2 border rounded-md pr-10"
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        disabled={loading}
                    >
                        {showPassword ? (
                            <FaEye size={18} />

                        ) : (
                            <IoMdEyeOff size={18} />
                        )}
                    </button>
                </div>

                <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    onChange={handleChange}
                    value={form.confirmPassword}
                    required
                    className="input w-full mb-4 px-4 py-2 border rounded-md"
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`input w-full cursor-pointer bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center`}
                >
                    {loading && <ClipLoader size={20} color="#fff" className="mr-2" />}
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
