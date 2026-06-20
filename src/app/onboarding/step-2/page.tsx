"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OnboardingLayout from "@/customComponents/components/OnboardingLayout";
import { saveOnboardingData, loadOnboardingData } from "@/lib/onboarding";

export default function OnboardingStep2() {
  const router = useRouter();
  const { status } = useSession();
  const [savedRole] = useState(() => loadOnboardingData().role);
  const [location, setLocation] = useState(
    () => loadOnboardingData().location
  );
  const [image, setImage] = useState(() => loadOnboardingData().image);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (!savedRole) router.push("/onboarding/step-1");
  }, [savedRole, status, router]);

  const handleContinue = () => {
    if (!location.trim()) { setError("Please enter your location"); return; }
    saveOnboardingData({ location, image });
    router.push("/onboarding/step-3");
  };

  const handleBack = () => router.push("/onboarding/step-1");

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <OnboardingLayout currentStep={2}>
      <h2 className="text-2xl font-bold mb-1">Your Profile</h2>
      <p className="text-gray-500 mb-6">Help others know who you are</p>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Location</label>
          <input
            type="text"
            placeholder="e.g. Lagos, Nigeria"
            className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
            value={location}
            onChange={(e) => { setLocation(e.target.value); setError(""); }}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">
            Profile Photo URL{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="https://..."
            className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      <div className="flex justify-between mt-8">
        <button type="button" onClick={handleBack} className="text-sm text-gray-500 hover:text-black">
          ← Back
        </button>
        <button type="button" onClick={handleContinue}
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium">
          Continue →
        </button>
      </div>
    </OnboardingLayout>
  );
}
