import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddSpecializationModal({ onClose, onCreated }) {
    const token = sessionStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        setSubmitting(true);
        try {
            const res = await axios.post(
                `${apiUrl}/Admin/Specialization/Create`,
                { name },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            onCreated(res.data);
            toast.success("Specialization created");
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Creation failed");
        }
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0  backdrop-blur-xs flex justify-center items-center z-50 p-4">
            <div className="bg-yellow-100 rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Add Specialization</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Specialization name"
                        className="border rounded px-3 py-2 focus:outline-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={submitting}
                        autoFocus
                    />
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
