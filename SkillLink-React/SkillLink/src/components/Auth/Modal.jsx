import React from "react";

export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-yellow-100 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <button
                    className="absolute -top-3.5 right-0 cursor-pointer text-gray-500 hover:text-red-500 text-[30px]"
                    onClick={onClose}
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}