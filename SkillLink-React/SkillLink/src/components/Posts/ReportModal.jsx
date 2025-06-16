import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

const reportOptions = {
    comment: [
        { value: "InappropriateComment", label: "Inappropriate Comment" },
        { value: "Spam", label: "Spam" },
        { value: "Harassment", label: "Harassment" },
        { value: "HateSpeech", label: "Hate Speech" },
        { value: "FakeProfile", label: "Fake Profile" },
        { value: "Other", label: "Other" },
    ],
    post: [
        { value: "InappropriateContent", label: "Inappropriate Content" },
        { value: "Spam", label: "Spam" },
        { value: "FalseInformation", label: "False Information" },
        { value: "HateSpeech", label: "Hate Speech" },
        { value: "ViolenceOrThreats", label: "Violence or Threats" },
        { value: "CopyrightViolation", label: "Copyright Violation" },
        { value: "Other", label: "Other" },
    ],
    user: [
        { value: "FakeProfile", label: "Fake Profile" },
        { value: "Harassment", label: "Harassment / Bullying" },
        { value: "Spam", label: "Spam" },
        { value: "InappropriateBehavior", label: "Inappropriate Behavior" },
        { value: "Impersonation", label: "Impersonation" },
        { value: "Other", label: "Other" },
    ],
};

const ReportModal = ({ isOpen, onClose, onSubmit, loading, type }) => {
    const [reason, setReason] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setReason("");
            setNote("");
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (!reason) {
            toast.error("Please select a reason.");
            return;
        }
        onSubmit({ reason, note });
    };

    if (!isOpen) return null;

    const options = reportOptions[type] || [];

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
            <div className="bg-cyan-50 p-5 rounded shadow-lg w-96 max-w-full">
                <h2 className="text-lg font-semibold mb-4">Report</h2>

                <label className="block mb-2 font-medium" htmlFor="reason">
                    Reason:
                </label>
                <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                >
                    <option value="">-- Select Reason --</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <label className="block mb-2 font-medium" htmlFor="note">
                    Note (optional):
                </label>
                <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border rounded p-2 mb-4"
                    rows={3}
                    placeholder="Add a note if needed..."
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 duration-300 bg-gray-300 cursor-pointer rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 duration-300 flex items-center justify-center bg-green-600 cursor-pointer text-white rounded hover:bg-green-700"
                    >
                        {loading ? <Loader className="text-blue-600" /> : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
