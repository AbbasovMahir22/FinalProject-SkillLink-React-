// src/pages/Forbidden.jsx
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineShieldExclamation } from "react-icons/hi";

const Forbidden = () => {
    const navigate = useNavigate();
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <section className="bg-white p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
                <HiOutlineShieldExclamation className="mx-auto text-yellow-500 text-5xl mb-4" />
                <h1 className="text-3xl font-bold text-yellow-500 mb-2">403 - Forbidden</h1>
                <p className="text-gray-700 mb-6">
                    You do not have permission to access this page.
                </p>

                <Link
                    onClick={navigate('/login')}
                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-5 rounded-lg transition"
                >
                    Return to home page
                </Link>
            </section>
        </main>
    );
};

export default Forbidden;
