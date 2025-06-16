import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditSpecializationModal({ specialization, onClose, onUpdated }) {
    const token = sessionStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const [newName, setNewName] = useState(specialization.name || "");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setNewName(specialization.name || "");
    }, [specialization]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newName.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        setSubmitting(true);
        try {
            await axios.put(
                `${apiUrl}/Admin/Specialization/Update/${specialization.id}`,
                { newName },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            onUpdated({ id: specialization.id, name: newName });
            toast.success("Specialization updated");
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Update failed");
        }
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 backdrop-blur-xs  flex justify-center items-center z-50 p-4">
            <div className="bg-yellow-100 rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Specialization</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Specialization name"
                        className="border rounded px-3 py-2 focus:outline-blue-500"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
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
