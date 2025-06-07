import React from 'react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8 lg:px-32">
            <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12">
                <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Terms and Conditions</h1>

                <p className="text-gray-700 mb-4">
                    Welcome to our platform! These terms and conditions outline the rules and regulations for the use of our website.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                    By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use our website if you do not accept all of the terms stated on this page.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">2. Intellectual Property Rights</h2>
                <p className="text-gray-700 mb-4">
                    Unless otherwise stated, we own the intellectual property rights for all material on the platform. All intellectual property rights are reserved.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">3. User Obligations</h2>
                <p className="text-gray-700 mb-4">
                    Users must not use the website in any way that is unlawful, harmful, or in connection with any illegal activity.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">4. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                    We are not liable for any damages arising out of the use or inability to use the materials on our platform.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">5. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                    We may revise these terms at any time without notice. By using this website you are agreeing to be bound by the current version.
                </p>

                <p className="text-gray-600 mt-8 text-sm text-center">
                    Last updated: June 4, 2025
                </p>
            </div>
        </div>
    );
};

export default Terms;
