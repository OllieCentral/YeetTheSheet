"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#2a2a4e] rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <svg className="mx-auto mb-4" width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="#e94560" strokeWidth="10"/>
            <path d="M30 70 Q 50 40 70 70" stroke="#34d399" strokeWidth="8" fill="none"/>
            <path d="M35 50 H 65" stroke="#60a5fa" strokeWidth="8"/>
          </svg>
          <h1 className="text-3xl font-bold text-white mb-2">Finance Tracker Pro</h1>
          <p className="text-gray-400">Take control of your finances</p>
        </div>
        <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((_error) => {
            const toastTitle =
              flow === "signIn"
                ? "Could not sign in, did you mean to sign up?"
                : "Could not sign up, did you mean to sign in?";
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <input
          className="w-full px-4 py-3 bg-[#1a1a2e] border border-[#4a4a6e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="w-full px-4 py-3 bg-[#1a1a2e] border border-[#4a4a6e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
          type="submit" 
          disabled={submitting}
        >
          {submitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {flow === "signIn" ? "Signing in..." : "Signing up..."}
            </div>
          ) : (
            flow === "signIn" ? "Sign in" : "Sign up"
          )}
        </button>
        <div className="text-center text-sm text-gray-400">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-blue-400 hover:text-blue-300 cursor-pointer underline"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
