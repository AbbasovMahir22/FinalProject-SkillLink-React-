import { motion, AnimatePresence } from "framer-motion";

const NoPostsPrompt = ({ open, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: "-50%" }}
                        animate={{ scale: 1, opacity: 1, y: "-50%" }}
                        exit={{ scale: 0.9, opacity: 0, y: "-50%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md p-6 bg-white rounded-2xl shadow-xl text-center"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-2">No posts to show</h2>
                        <p className="text-gray-600 mb-6">Do you want to explore other posts?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 cursor-pointer rounded bg-gray-200 hover:bg-gray-300"
                                onClick={onClose}
                            >
                                No
                            </button>
                            <button
                                className="px-4 py-2 rounded cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() => {
                                    onClose();
                                    onConfirm();
                                }}
                            >
                                Yes
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NoPostsPrompt;
