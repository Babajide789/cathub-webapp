// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSession, signIn } from "next-auth/react";

// const ROLES = [
//   { value: "OWNER", label: "Cat Owner", emoji: "🐱", desc: "I own one or more cats" },
//   { value: "BUYER", label: "Buyer", emoji: "🛍️", desc: "I want to adopt or shop for cats" },
//   { value: "SELLER", label: "Seller", emoji: "🏪", desc: "I sell cat products or services" },
//   { value: "SERVICE_PROVIDER", label: "Service Provider", emoji: "🩺", desc: "I provide vet or grooming services" },
// ];

// const INTERESTS = [
//   { key: "adoption", label: "Adoption" },
//   { key: "marketplace", label: "Marketplace" },
//   { key: "mating", label: "Mating Services" },
//   { key: "vets", label: "Veterinary Services" },
// ];

// export default function OnboardingPage() {
//   const router = useRouter();
//   const { data: session, status, update } = useSession();

//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Step 1
//   const [role, setRole] = useState("");

//   // Step 2
//   const [location, setLocation] = useState("");
//   const [image, setImage] = useState("");

//   // Step 3
//   const [catName, setCatName] = useState("");
//   const [catBreed, setCatBreed] = useState("");
//   const [catAge, setCatAge] = useState("");
//   const [catImage, setCatImage] = useState("");

//   // Step 4
//   const [interests, setInterests] = useState<string[]>([]);
//   const [notifyAdoption, setNotifyAdoption] = useState(false);
//   const [notifyMarketplace, setNotifyMarketplace] = useState(false);
//   const [notifyMating, setNotifyMating] = useState(false);
//   const [notifyVets, setNotifyVets] = useState(false);

//   // Bug fix 2 — redirect if not signed in
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/auth/signin");
//     }
//   }, [status, router]);

//   const toggleInterest = (key: string) => {
//     setInterests((prev) =>
//       prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
//     );
//   };

//   const skipCatStep = role === "BUYER" || role === "SERVICE_PROVIDER";

//   // Bug fix 1 — clean step logic with explicit returns everywhere
//   const handleNext = () => {
//     setError("");

//     if (step === 1) {
//       if (!role) {
//         setError("Please select a role");
//         return;
//       }
//       setStep(2);
//       return;
//     }

//     if (step === 2) {
//       if (!location) {
//         setError("Please enter your location");
//         return;
//       }
//       setStep(3);
//       return;
//     }

//     if (step === 3) {
//       // Skip cat step for buyers and service providers
//       setStep(4);
//       return;
//     }
//   };

//   const handleBack = () => {
//     setError("");
//     setStep((s) => s - 1);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/onboarding", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           role,
//           location,
//           image,
//           cat: catName
//             ? { name: catName, breed: catBreed, age: catAge, image: catImage }
//             : null,
//           preferences: {
//             interests,
//             notifyAdoption,
//             notifyMarketplace,
//             notifyMating,
//             notifyVets,
//           },
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || "Something went wrong");
//         setLoading(false);
//         return;
//       }

//       // Bug fix 3 — force JWT session refresh before redirecting
//       // so middleware sees hasOnboarded: true and doesn't loop back
//       await update({ hasOnboarded: true });
//       router.push("/");

//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//       setLoading(false);
//     }
//   };

//   // Show loading spinner only while session is resolving
//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-400 text-sm">Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white rounded-2xl shadow p-8 w-full max-w-lg">

//         {/* Progress Bar */}
//         <div className="flex gap-2 mb-8">
//           {[1, 2, 3, 4].map((s) => (
//             <div
//               key={s}
//               className={`h-1.5 flex-1 rounded-full transition-all ${
//                 s <= step ? "bg-black" : "bg-gray-200"
//               }`}
//             />
//           ))}
//         </div>

//         {/* Step 1 — Role */}
//         {step === 1 && (
//           <div>
//             <h2 className="text-2xl font-bold mb-1">Welcome to CATHUB</h2>
//             <p className="text-gray-500 mb-6">What best describes you?</p>
//             <div className="grid grid-cols-2 gap-3">
//               {ROLES.map((r) => (
//                 <button
//                   key={r.value}
//                   onClick={() => setRole(r.value)}
//                   className={`border-2 rounded-xl p-4 text-left transition-all ${
//                     role === r.value
//                       ? "border-black bg-black text-white"
//                       : "border-gray-200 hover:border-gray-400"
//                   }`}
//                 >
//                   <div className="text-2xl mb-1">{r.emoji}</div>
//                   <div className="font-semibold text-sm">{r.label}</div>
//                   <div className={`text-xs mt-0.5 ${role === r.value ? "text-gray-300" : "text-gray-400"}`}>
//                     {r.desc}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Step 2 — Profile */}
//         {step === 2 && (
//           <div>
//             <h2 className="text-2xl font-bold mb-1">Your Profile</h2>
//             <p className="text-gray-500 mb-6">Help others know who you are</p>
//             <div className="flex flex-col gap-4">
//               <div>
//                 <label className="text-sm font-medium block mb-1">Location</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Lagos, Nigeria"
//                   className="border rounded-lg p-3 w-full"
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium block mb-1">
//                   Profile Photo URL{" "}
//                   <span className="text-gray-400 font-normal">(optional)</span>
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="https://..."
//                   className="border rounded-lg p-3 w-full"
//                   value={image}
//                   onChange={(e) => setImage(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 3 — Cat Info */}
//         {step === 3 && (
//           <div>
//             <h2 className="text-2xl font-bold mb-1">Your Cat</h2>
//             <p className="text-gray-500 mb-6">
//               {skipCatStep
//                 ? "This step is optional for your role — feel free to skip"
//                 : "Tell us about your cat"}
//             </p>
//             {!skipCatStep ? (
//               <div className="flex flex-col gap-4">
//                 <div>
//                   <label className="text-sm font-medium block mb-1">Cat's Name</label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Whiskers"
//                     className="border rounded-lg p-3 w-full"
//                     value={catName}
//                     onChange={(e) => setCatName(e.target.value)}
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-sm font-medium block mb-1">Breed</label>
//                     <input
//                       type="text"
//                       placeholder="e.g. Persian"
//                       className="border rounded-lg p-3 w-full"
//                       value={catBreed}
//                       onChange={(e) => setCatBreed(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium block mb-1">Age (years)</label>
//                     <input
//                       type="number"
//                       placeholder="e.g. 2"
//                       className="border rounded-lg p-3 w-full"
//                       value={catAge}
//                       onChange={(e) => setCatAge(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium block mb-1">
//                     Cat Photo URL{" "}
//                     <span className="text-gray-400 font-normal">(optional)</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="https://..."
//                     className="border rounded-lg p-3 w-full"
//                     value={catImage}
//                     onChange={(e) => setCatImage(e.target.value)}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <p className="text-sm text-gray-400 italic">
//                 Click Continue to proceed.
//               </p>
//             )}
//           </div>
//         )}

//         {/* Step 4 — Preferences */}
//         {step === 4 && (
//           <div>
//             <h2 className="text-2xl font-bold mb-1">Your Preferences</h2>
//             <p className="text-gray-500 mb-6">Customise your CATHUB experience</p>

//             <div className="mb-6">
//               <p className="text-sm font-medium mb-3">I'm interested in:</p>
//               <div className="grid grid-cols-2 gap-2">
//                 {INTERESTS.map((i) => (
//                   <button
//                     key={i.key}
//                     onClick={() => toggleInterest(i.key)}
//                     className={`border-2 rounded-lg p-3 text-sm font-medium transition-all ${
//                       interests.includes(i.key)
//                         ? "border-black bg-black text-white"
//                         : "border-gray-200 hover:border-gray-400"
//                     }`}
//                   >
//                     {i.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <p className="text-sm font-medium mb-3">Email notifications:</p>
//               <div className="flex flex-col gap-2">
//                 {[
//                   { label: "Adoption updates", value: notifyAdoption, setter: setNotifyAdoption },
//                   { label: "Marketplace deals", value: notifyMarketplace, setter: setNotifyMarketplace },
//                   { label: "Mating requests", value: notifyMating, setter: setNotifyMating },
//                   { label: "Vet availability", value: notifyVets, setter: setNotifyVets },
//                 ].map((item) => (
//                   <label key={item.label} className="flex items-center gap-3 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={item.value}
//                       onChange={(e) => item.setter(e.target.checked)}
//                       className="w-4 h-4"
//                     />
//                     <span className="text-sm">{item.label}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error */}
//         {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

//         {/* Navigation */}
//         <div className="flex justify-between mt-8">
//           {step > 1 ? (
//             <button
//               onClick={handleBack}
//               className="text-sm text-gray-500 hover:text-black"
//             >
//               ← Back
//             </button>
//           ) : (
//             <div />
//           )}

//           {step < 4 ? (
//             <button
//               onClick={handleNext}
//               className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium"
//             >
//               Continue →
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
//             >
//               {loading ? "Setting up..." : "Finish →"}
//             </button>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }