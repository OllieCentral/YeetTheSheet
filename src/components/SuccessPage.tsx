import React, { useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const SuccessPage: React.FC = () => {
  const paymentStatus = useQuery(api.payments.getUserPaymentStatus);

  useEffect(() => {
    // Redirect to app after a few seconds
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#2a2a4e] rounded-lg shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-gray-400 mb-6">
          Thank you for purchasing Finance Tracker Pro. You now have lifetime access to all features.
        </p>

        {paymentStatus?.paymentDate && (
          <div className="bg-[#1a1a2e] rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400">Purchase Date</p>
            <p className="text-white font-medium">
              {new Date(paymentStatus.paymentDate).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="text-sm text-gray-500">
          Redirecting to your dashboard in a few seconds...
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
