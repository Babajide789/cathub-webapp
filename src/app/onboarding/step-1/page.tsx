"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OnboardingLayout from "@/customComponents/components/OnboardingLayout";
import { saveOnboardingData, loadOnboardingData } from "@/lib/onboarding";

const ROLES = [
  { value: "OWNER", label: "Cat Owner", emoji: "🐱", desc: "I own one or more cats" },
  { value: "BUYER", label: "Buyer", emoji: "🛍️", desc: "I want to adopt or shop for cats" },
  { value: "SELLER", label: "Seller", emoji: "🏪", desc: "I sell cat products or services" },
  { value: "SERVICE_PROVIDER", label: "Service Provider", emoji: "🩺", desc: "I provide vet or grooming services" },
];

export default function OnboardingStep1() {
  const router = useRouter();
  const { status } = useSession();
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    const saved = loadOnboardingData();
    if (saved.role) setRole(saved.role);
  }, [status, router]);

  const handleContinue = () => {
    if (!role) { setError("Please select a role to continue"); return; }
    saveOnboardingData({ role });
    router.push("/onboarding/step-2");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <OnboardingLayout currentStep={1}>
      <h2 className="text-2xl font-bold mb-1">Welcome to CATHUB</h2>
      <p className="text-gray-500 mb-6">What best describes you?</p>

      <div className="grid grid-cols-2 gap-3">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => { setRole(r.value); setError(""); }}
            className={`border-2 rounded-xl p-4 text-left transition-all ${
              role === r.value
                ? "border-black bg-black text-white"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="text-2xl mb-1">{r.emoji}</div>
            <div className="font-semibold text-sm">{r.label}</div>
            <div className={`text-xs mt-0.5 ${role === r.value ? "text-gray-300" : "text-gray-400"}`}>
              {r.desc}
            </div>
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={handleContinue}
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium"
        >
          Continue →
        </button>
      </div>
    </OnboardingLayout>
  );
}