import React from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface PaymentGateProps {
  children: React.ReactNode;
}

const PaymentGate: React.FC<PaymentGateProps> = ({ children }) => {
  const paymentStatus = useQuery(api.payments.getUserPaymentStatus);
  // const createCheckout = useAction(api.payments.createCheckoutSession);
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Stripe checkout
      alert('Payment system coming soon! For now, you have full access.');
      // Temporarily mark as paid for demo purposes
      window.location.reload();
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start payment process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentStatus === undefined) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking payment status...</p>
        </div>
      </div>
    );
  }

  // Temporarily allow access for demo purposes
  // if (paymentStatus.hasPaid) {
    return <>{children}</>;
  // }

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#2a2a4e] rounded-lg shadow-xl p-8 text-center">
        {/* Logo */}
        <div className="mb-6">
          <svg className="mx-auto" width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="#e94560" strokeWidth="10"/>
            <path d="M30 70 Q 50 40 70 70" stroke="#34d399" strokeWidth="8" fill="none"/>
            <path d="M35 50 H 65" stroke="#60a5fa" strokeWidth="8"/>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Finance Tracker Pro</h1>
        <p className="text-gray-400 mb-8">Take control of your finances with our comprehensive tracking tool</p>

        {/* Features */}
        <div className="text-left mb-8 space-y-3">
          <div className="flex items-center text-gray-300">
            <span className="text-green-400 mr-3">✓</span>
            Track expenses and income
          </div>
          <div className="flex items-center text-gray-300">
            <span className="text-green-400 mr-3">✓</span>
            Categorize transactions
          </div>
          <div className="flex items-center text-gray-300">
            <span className="text-green-400 mr-3">✓</span>
            Set income goals
          </div>
          <div className="flex items-center text-gray-300">
            <span className="text-green-400 mr-3">✓</span>
            Monthly summaries & insights
          </div>
          <div className="flex items-center text-gray-300">
            <span className="text-green-400 mr-3">✓</span>
            Real-time dashboard
          </div>
          <div className="flex items-center text-gray-300">
            <span className="text-green-400 mr-3">✓</span>
            Lifetime access
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-[#1a1a2e] rounded-lg p-6 mb-6">
          <div className="text-4xl font-bold text-white mb-2">$9.99</div>
          <div className="text-gray-400">One-time payment</div>
          <div className="text-sm text-green-400 mt-1">No monthly fees • Lifetime access</div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            'Get Lifetime Access'
          )}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
};

export default PaymentGate;
