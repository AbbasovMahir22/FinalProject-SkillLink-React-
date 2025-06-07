import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function ResetPassword() {
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
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
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-orange-400 text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-white text-black p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
                <input
                    type="password"
                    name="password"
                    placeholder="New Password"
                    onChange={handleChange}
                    required
                    className="w-full mb-4 px-4 py-2 border rounded-md"
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    onChange={handleChange}
                    required
                    className="w-full mb-4 px-4 py-2 border rounded-md"
                />
                <button
                    type="submit"
                    className="w-full cursor-pointer bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
