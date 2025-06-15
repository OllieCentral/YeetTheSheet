import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInForm } from "./SignInForm";
import Layout from "./components/Layout";
import PaymentGate from "./components/PaymentGate";
import SuccessPage from "./components/SuccessPage";
import { Toaster } from "sonner";

function App() {
  // Check if we're on the success page
  const isSuccessPage = window.location.pathname === '/success' || window.location.search.includes('session_id');

  return (
    <>
      <AuthLoading>
        <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
      <Authenticated>
        {isSuccessPage ? (
          <SuccessPage />
        ) : (
          <PaymentGate>
            <Layout />
          </PaymentGate>
        )}
      </Authenticated>
      <Toaster />
    </>
  );
}

export default App;
