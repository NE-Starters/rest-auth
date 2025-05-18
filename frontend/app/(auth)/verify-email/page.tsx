"use client";

import { useState } from 'react';

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // In a real application, you would get the token from the URL query parameters
  // For example: const token = new URLSearchParams(window.location.search).get('token');
  const token = "sample-verification-token";
  
  const handleVerify = () => {
    setIsVerifying(true);
    
    // Simulate API call to verify email
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        
        {isVerified ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Email verified successfully!</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Your email has been verified. You can now login to your account.
              </p>
            </div>
            <div className="mt-5">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Click the button below to verify your email address
            </p>
            <div className="mt-5">
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Token: {token}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}