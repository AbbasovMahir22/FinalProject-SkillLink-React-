import React from "react";
import { ImCancelCircle } from "react-icons/im";
const AddCategoryModal = ({ value, setValue, onSave, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
            <div className="bg-yellow-200 rounded-lg p-6 w-80 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 cursor-pointer text-gray-500 hover:text-gray-700 font-bold text-lg"
                    title="Close"
                >
                    <ImCancelCircle />
                </button>
                <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
                <input
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="Category name"
                    className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                    autoFocus
                />
                <button
                    onClick={onSave}
                    className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default AddCategoryModal;
