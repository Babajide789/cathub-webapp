"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OnboardingLayout from "@/customComponents/components/OnboardingLayout";
import { saveOnboardingData, loadOnboardingData } from "@/lib/onboarding";

export default function OnboardingStep3() {
  const router = useRouter();
  const { status } = useSession();
  const [role] = useState(() => loadOnboardingData().role);
  const [catName, setCatName] = useState(() => loadOnboardingData().catName);
  const [catBreed, setCatBreed] = useState(() => loadOnboardingData().catBreed);
  const [catAge, setCatAge] = useState(() => loadOnboardingData().catAge);
  const [catImage, setCatImage] = useState(() => loadOnboardingData().catImage);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (!role) router.push("/onboarding/step-1");
  }, [role, status, router]);

  const skipCatStep = role === "BUYER" || role === "SERVICE_PROVIDER";

  const handleContinue = () => {
    saveOnboardingData({ catName, catBreed, catAge, catImage });
    router.push("/onboarding/step-4");
  };

  const handleSkip = () => {
    saveOnboardingData({ catName: "", catBreed: "", catAge: "", catImage: "" });
    router.push("/onboarding/step-4");
  };

  const handleBack = () => router.push("/onboarding/step-2");

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <OnboardingLayout currentStep={3}>
      <h2 className="text-2xl font-bold mb-1">Your Cat</h2>
      <p className="text-gray-500 mb-6">
        {skipCatStep
          ? "This step is optional for your role"
          : "Tell us about your cat"}
      </p>

      {skipCatStep ? (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🐱</div>
          <p className="text-gray-500 text-sm">
            Cat info isn&apos;t required for your role. You can skip this step or add a cat you care about.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Cat&apos;s Name</label>
            <input type="text" placeholder="e.g. Whiskers"
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
              value={catName} onChange={(e) => setCatName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1">Breed</label>
              <input type="text" placeholder="e.g. Persian"
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                value={catBreed} onChange={(e) => setCatBreed(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Age (years)</label>
              <input type="number" placeholder="e.g. 2"
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
                value={catAge} onChange={(e) => setCatAge(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">
              Cat Photo URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input type="text" placeholder="https://..."
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-black"
              value={catImage} onChange={(e) => setCatImage(e.target.value)} />
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button type="button" onClick={handleBack} className="text-sm text-gray-500 hover:text-black">
          ← Back
        </button>
        <div className="flex gap-3">
          {(skipCatStep || !catName) && (
            <button type="button" onClick={handleSkip}
              className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg text-sm font-medium hover:border-gray-500">
              Skip
            </button>
          )}
          <button type="button" onClick={handleContinue}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium">
            Continue →
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
