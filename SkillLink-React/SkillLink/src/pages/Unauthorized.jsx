// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";
import { HiOutlineKey } from "react-icons/hi";

const Unauthorized = () => {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <section className="bg-white p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
                <HiOutlineKey className="mx-auto text-red-600 text-5xl mb-4" />
                <h1 className="text-3xl font-bold text-red-600 mb-2">401 - Unauthorized</h1>
                <p className="text-gray-700 mb-6">

                    You are not authorized in the system. Sign in to continue.
                </p>

                <Link
                    to="/login"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition"
                >
                    Login
                </Link>
            </section>
        </main>
    );
};

export default Unauthorized;
