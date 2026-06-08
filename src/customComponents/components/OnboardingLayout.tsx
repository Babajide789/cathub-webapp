"use client";

const STEPS = ["Role", "Profile", "Your Cat", "Preferences", "Summary"];

export default function OnboardingLayout({
  children,
  currentStep,
}: {
  children: React.ReactNode;
  currentStep: number; // 1-5
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-lg">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i + 1 <= currentStep ? "bg-black" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mb-8">
          Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1]}
        </p>
        {children}
      </div>
    </div>
  );
}