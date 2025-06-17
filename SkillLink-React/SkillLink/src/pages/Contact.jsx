import axios from "axios";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Contact() {
    const [formData, setFormData] = useState({ fullName: "", email: "", message: "" });
    const [errors, setErrors] = useState({});
    const apiUrl = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(prev => ({ ...prev, [e.target.name]: "" }), setLoading(false));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.message.trim()) newErrors.message = "Message is required";
        return newErrors;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);


        try {
            await axios.post(`${apiUrl}/Account/ContactMail`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setLoading(false);
            toast.success("Message sent successfully!");

            setFormData({ fullName: "", email: "", message: "" });
        } catch (error) {
            setLoading(false);
            toast.error("Failed to send message. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen select-none bg-gradient-to-tr from-orange-400 via-blue-500 to-blue-700 flex flex-col items-center justify-center px-4 py-1 font-sans">
            <Toaster />
            <h1 className="text-orange-600 text-6xl font-extrabold tracking-widest mb-5 select-none drop-shadow-lg">
                <span className="text-orange-600">Skill</span><span className="text-cyan-300">Link</span>
            </h1>

            <div className="bg-white bg-opacity-40 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full p-3">
                <h2 className="text-orange-400 text-3xl font-bold mb-6 text-center drop-shadow-md">
                    Contact Us
                </h2>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-5 px-3">
                    <label htmlFor="name" className="block text-black font-semibold tracking-wide">
                        Name
                    </label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Your full name"
                        autoComplete="off"
                        value={formData.fullName}
                        onChange={handleChange}
                        aria-describedby="name-error"
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border-2 transition-colors focus:outline-none
              ${errors.fullName
                                ? "border-red-500 bg-red-50 text-red-700"
                                : "border-orange-300 bg-white text-gray-900 focus:border-blue-500"
                            }
            `}
                    />
                    {errors.name && (
                        <p id="name-error" className="text-red-600 text-sm -mt-3">
                            {errors.name}
                        </p>
                    )}

                    <label htmlFor="email" className="block text-black font-semibold tracking-wide">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="off"
                        value={formData.email}
                        onChange={handleChange}
                        aria-describedby="email-error"
                        required
                        className={`w-full px-4 py-1.5 rounded-xl border-2 transition-colors focus:outline-none
              ${errors.email
                                ? "border-red-500 bg-red-50 text-red-700"
                                : "border-orange-300 bg-white text-gray-900 focus:border-blue-500"
                            }
            `}
                    />
                    {errors.email && (
                        <p id="email-error" className="text-red-600 text-sm -mt-3">
                            {errors.email}
                        </p>
                    )}

                    <label htmlFor="message" className="block text-black font-semibold tracking-wide">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Write your message here..."
                        value={formData.message}
                        onChange={handleChange}
                        aria-describedby="message-error"
                        required
                        rows={4}
                        className={`w-full px-4 h-[100px] max-h-[200px] py-1.5 rounded-xl border-2 resize-y transition-colors focus:outline-none
              ${errors.message
                                ? "border-red-500 bg-red-50 text-red-700"
                                : "border-orange-300 bg-white text-gray-900 focus:border-blue-500"
                            }
            `}
                    />
                    {errors.message && (
                        <p id="message-error" className="text-red-600 text-sm -mt-3">
                            {errors.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="mt-2 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-800
              text-black font-bold py-2 flex items-center justify-center hover:text-white rounded-2xl cursor-pointer shadow-lg transition-colors duration-300"
                    >
                        {loading ? <Loader /> : "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
}
