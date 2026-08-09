"use client";

import type { NextPage } from "next";
import { loginWithGoogle } from "@/lib/supabase/actions/auth.actions";

const Login: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-[0.99]"
          >
            {/* Google Icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.35 12.23c0-.79-.07-1.55-.22-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                fill="#4285F4"
              />

              <path
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
                fill="#34A853"
              />

              <path
                d="M6.54 13.6a5.86 5.86 0 0 1 0-3.75V7.32H3.3a9.75 9.75 0 0 0 0 8.81l3.24-2.53Z"
                fill="#FBBC05"
              />

              <path
                d="M12 5.82c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 2.91 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.82l3.24 2.53C7.31 7.54 9.46 5.82 12 5.82Z"
                fill="#EA4335"
              />
            </svg>

            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-gray-400">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-gray-600 hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-gray-600 hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;