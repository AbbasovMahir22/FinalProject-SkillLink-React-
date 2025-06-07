import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 sm:px-10 lg:px-32">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center">Privacy Policy</h1>

        <p className="text-gray-700 mb-4">
          This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you visit our website or use our services. Please read this
          policy carefully to understand our views and practices regarding your personal
          data.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Personal identification information (Name, Email address, etc.)</li>
          <li>Device and usage data (IP address, browser type, etc.)</li>
          <li>Cookies and tracking technologies</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>To provide and maintain our services</li>
          <li>To communicate with you</li>
          <li>To improve our platform</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-2">3. Sharing Your Information</h2>
        <p className="text-gray-700 mb-4">
          We do not sell or rent your personal data. We may share information with
          trusted third parties who help us operate our website or provide services,
          as long as they agree to keep your information confidential.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-2">4. Your Rights</h2>
        <p className="text-gray-700 mb-4">
          You have the right to access, update, or delete your personal information.
          You may also opt-out of communications at any time.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-2">5. Changes to This Policy</h2>
        <p className="text-gray-700 mb-4">
          We may update this Privacy Policy from time to time. Any changes will be
          posted on this page with an updated revision date.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-2">6. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions or concerns about this Privacy Policy, please contact
          us at <a href="https://e.mail.ru/inbox/" className="text-blue-600 hover:underline">mahirta@code.edu.az</a>.
        </p>
      </div>
    </div>
  );
};

export default Privacy;