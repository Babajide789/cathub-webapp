"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    // Sign in then hard-redirect — middleware will send to /onboarding/step-1
    // because hasOnboarded is false on new accounts
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Account created but sign in failed. Please sign in manually.");
      setLoading(false);
      return;
    }

    window.location.href = "/onboarding/step-1";
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Create Account</h1>
        <p className="text-gray-500 text-sm mb-6">Join the CATHUB community</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white p-3 rounded-lg font-medium disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-black font-medium underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}