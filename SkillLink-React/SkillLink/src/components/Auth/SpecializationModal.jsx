import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

export default function SpecializationModal({ isOpen, onClose, onSaved }) {
    const [specializations, setSpecializations] = useState([]);
    const [selectedId, setSelectedId] = useState("");

    useEffect(() => {
        const fetchSpecializations = async () => {
            const token = localStorage.getItem("token");
            const res = await axios.get("https://localhost:7067/api/Specialization/GetAll", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSpecializations(res.data.$values);
        };

        if (isOpen) {
            fetchSpecializations();
        }
    }, [isOpen]);

    const handleSave = async () => {
        const token = localStorage.getItem("token");

        await axios.put(`https://localhost:7067/api/Account/UpdateUserSpecialization/${selectedId}`,{}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        onSaved();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-lg font-semibold mb-4">Select Your Specialization</h2>
            <select
                className="w-full border p-2 mb-4 cursor-pointer"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
            >
                <option value="">-- Select --</option>
                {specializations.map(s => (
                    <option  key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>
            <button
                className="bg-blue-600 cursor-pointer hover:bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSave}
                disabled={!selectedId}
            >
                Save
            </button>
        </Modal>
    );
}
