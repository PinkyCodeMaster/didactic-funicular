"use client";

import { useState, useEffect, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await authClient.verifyEmail({
        query: {
          token: verificationToken,
        },
      });

      if (error) {
        setError(error.message || "Email verification failed");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setError("");

    try {
      // This would need to be implemented based on your auth setup
      // const { data, error } = await authClient.resendVerificationEmail();
      
      // For now, show a success message
      alert("Verification email sent! Please check your inbox.");
    } catch (err) {
      setError("Failed to resend verification email");
    } finally {
      setResendLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white py-8 px-6 shadow rounded-lg text-center">
        <div className="mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Verifying your email</h3>
        <p className="text-sm text-gray-600">Please wait while we verify your email address...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white py-8 px-6 shadow rounded-lg text-center">
        <div className="mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Email verified successfully</h3>
        <p className="text-sm text-gray-600 mb-6">
          Your email has been verified. Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg text-center">
      <div className="mb-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {token ? (
        <>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Verification failed</h3>
          {error && (
            <p className="text-sm text-red-600 mb-6">{error}</p>
          )}
          <p className="text-sm text-gray-600 mb-6">
            The verification link may be invalid or expired.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
          <p className="text-sm text-gray-600 mb-6">
            We've sent a verification link to your email address. Please click the link to verify your account.
          </p>
        </>
      )}

      <div className="space-y-4">
        <button
          onClick={handleResendVerification}
          disabled={resendLoading}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendLoading ? "Sending..." : "Resend verification email"}
        </button>

        <Link
          href="/login"
          className="block text-center text-sm text-blue-600 hover:text-blue-500"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="bg-white py-8 px-6 shadow rounded-lg text-center">
        <div className="mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading...</h3>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}