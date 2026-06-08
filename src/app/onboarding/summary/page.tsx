"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OnboardingLayout from "@/customComponents/components/OnboardingLayout";
import { loadOnboardingData, clearOnboardingData, type OnboardingData } from "@/lib/onboarding";

const ROLE_LABELS: Record<string, string> = {
  OWNER: "🐱 Cat Owner",
  BUYER: "🛍️ Buyer",
  SELLER: "🏪 Seller",
  SERVICE_PROVIDER: "🩺 Service Provider",
};

export default function OnboardingSummary() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    const saved = loadOnboardingData();
    if (!saved.role) {
      router.push("/onboarding/step-1");
      return;
    }
    setData(saved);
  }, [status, router]);

  const handleSubmit = async () => {
  if (!data) return;
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: data.role,
        location: data.location,
        image: data.image,
        cat: data.catName
          ? { name: data.catName, breed: data.catBreed, age: data.catAge, image: data.catImage }
          : null,
        preferences: {
          interests: data.interests,
          notifyAdoption: data.notifyAdoption,
          notifyMarketplace: data.notifyMarketplace,
          notifyMating: data.notifyMating,
          notifyVets: data.notifyVets,
        },
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Something went wrong");
      setLoading(false);
      return;
    }

    clearOnboardingData();

    // ✅ Force the JWT to re-run with trigger="update", which re-reads
    // hasOnboarded=true from the DB before we navigate away
    await update();

    window.location.replace("/profile");

  } catch {
    setError("Something went wrong. Please try again.");
    setLoading(false);
  }
};

  if (status === "loading" || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <OnboardingLayout currentStep={5}>
      <h2 className="text-2xl font-bold mb-1">Almost done!</h2>
      <p className="text-gray-500 mb-6">Review your details before finishing</p>

      <div className="space-y-3">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Role</p>
          <p className="font-medium">{ROLE_LABELS[data.role] ?? data.role}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Location</p>
          <p className="font-medium">{data.location}</p>
        </div>

        {data.catName && (
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Cat</p>
            <p className="font-medium">
              {data.catName}
              {data.catBreed && <span className="text-gray-400 font-normal"> · {data.catBreed}</span>}
              {data.catAge && <span className="text-gray-400 font-normal"> · {data.catAge}yr</span>}
            </p>
          </div>
        )}

        {data.interests.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Interests</p>
            <p className="font-medium capitalize">{data.interests.join(", ")}</p>
          </div>
        )}
      </div>

      <div className="mt-4 mb-2">
        <button
          type="button"
          onClick={() => router.push("/onboarding/step-1")}
          className="text-sm text-gray-400 hover:text-black underline"
        >
          Edit details
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => router.push("/onboarding/step-4")}
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-8 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Setting up your account..." : "Finish & Go to Profile →"}
        </button>
      </div>
    </OnboardingLayout>
  );
}