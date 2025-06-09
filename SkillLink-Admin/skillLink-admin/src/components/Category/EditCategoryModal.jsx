import React from "react";
import { ImCancelCircle } from "react-icons/im";
import ClipLoader from "react-spinners/ClipLoader";

const EditCategoryModal = ({ value, setValue, onSave, onClose, isLoading }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
            <div className="bg-cyan-100 rounded-lg p-6 w-80 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 cursor-pointer text-gray-500 hover:text-gray-700 font-bold text-lg"
                    title="Close"
                    disabled={isLoading}
                >
                    <ImCancelCircle />
                </button>
                <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
                <input
                    type="text"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="Category name"
                    className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                    autoFocus
                    disabled={isLoading}
                />
                <button
                    onClick={onSave}
                    disabled={isLoading}
                    className={`flex justify-center cursor-pointer items-center gap-2 ${isLoading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                        } text-white px-4 py-2 rounded w-full transition`}
                >
                    {isLoading ? (
                        <>
                            <ClipLoader size={20} color="#fff" />
                            Updating...
                        </>
                    ) : (
                        "Update"
                    )}
                </button>
            </div>
        </div>
    );
};

export default EditCategoryModal;
