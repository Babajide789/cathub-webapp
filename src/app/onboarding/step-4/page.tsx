"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OnboardingLayout from "@/customComponents/components/OnboardingLayout";
import { saveOnboardingData, loadOnboardingData } from "@/lib/onboarding";

const INTERESTS = [
  { key: "adoption", label: "🏠 Adoption" },
  { key: "marketplace", label: "🛍️ Marketplace" },
  { key: "mating", label: "🐾 Mating Services" },
  { key: "vets", label: "🩺 Veterinary" },
];

export default function OnboardingStep4() {
  const router = useRouter();
  const { status } = useSession();
  const [savedRole] = useState(() => loadOnboardingData().role);
  const [interests, setInterests] = useState<string[]>(
    () => loadOnboardingData().interests
  );
  const [notifyAdoption, setNotifyAdoption] = useState(
    () => loadOnboardingData().notifyAdoption
  );
  const [notifyMarketplace, setNotifyMarketplace] = useState(
    () => loadOnboardingData().notifyMarketplace
  );
  const [notifyMating, setNotifyMating] = useState(
    () => loadOnboardingData().notifyMating
  );
  const [notifyVets, setNotifyVets] = useState(
    () => loadOnboardingData().notifyVets
  );

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (!savedRole) router.push("/onboarding/step-1");
  }, [savedRole, status, router]);

  const toggleInterest = (key: string) => {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const handleContinue = () => {
    saveOnboardingData({ interests, notifyAdoption, notifyMarketplace, notifyMating, notifyVets });
    router.push("/onboarding/summary");
  };

  const handleBack = () => router.push("/onboarding/step-3");

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <OnboardingLayout currentStep={4}>
      <h2 className="text-2xl font-bold mb-1">Your Preferences</h2>
      <p className="text-gray-500 mb-6">Customise your CATHUB experience</p>

      <div className="mb-6">
        <p className="text-sm font-medium mb-3">I&apos;m interested in:</p>
        <div className="grid grid-cols-2 gap-2">
          {INTERESTS.map((i) => (
            <button key={i.key} type="button" onClick={() => toggleInterest(i.key)}
              className={`border-2 rounded-lg p-3 text-sm font-medium transition-all ${
                interests.includes(i.key)
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-gray-400"
              }`}>
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-3">Email notifications:</p>
        <div className="flex flex-col gap-3">
          {[
            { label: "Adoption updates", value: notifyAdoption, setter: setNotifyAdoption },
            { label: "Marketplace deals", value: notifyMarketplace, setter: setNotifyMarketplace },
            { label: "Mating requests", value: notifyMating, setter: setNotifyMating },
            { label: "Vet availability", value: notifyVets, setter: setNotifyVets },
          ].map((item) => (
            <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                item.value ? "bg-black border-black" : "border-gray-300 group-hover:border-gray-500"
              }`}>
                {item.value && <span className="text-white text-xs">✓</span>}
              </div>
              <input type="checkbox" checked={item.value}
                onChange={(e) => item.setter(e.target.checked)} className="sr-only" />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button type="button" onClick={handleBack} className="text-sm text-gray-500 hover:text-black">
          ← Back
        </button>
        <button type="button" onClick={handleContinue}
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium">
          Review →
        </button>
      </div>
    </OnboardingLayout>
  );
}
