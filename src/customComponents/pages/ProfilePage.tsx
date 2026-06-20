"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Mail, Edit, LogOut, Cat, ShoppingBag, Heart } from "lucide-react";
import Image from "next/image";

type UserProfile = {
  name: string | null;
  email: string;
  image: string | null;
  location: string | null;
  role: string;
  interests: string[];
  createdAt: string;
  cats: { id: string; name: string; breed: string | null; age: number | null; image: string | null }[];
};

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Cat Owner",
  BUYER: "Buyer",
  SELLER: "Seller",
  SERVICE_PROVIDER: "Service Provider",
  USER: "Member",
};

const ROLE_COLORS: Record<string, string> = {
  OWNER: "bg-amber-100 text-amber-800",
  BUYER: "bg-blue-100 text-blue-800",
  SELLER: "bg-green-100 text-green-800",
  SERVICE_PROVIDER: "bg-purple-100 text-purple-800",
  USER: "bg-gray-100 text-gray-800",
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState<"cats" | "interests" | "orders">("cats");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => {
          setProfile(data);
          setLoadingProfile(false);
        })
        .catch(() => setLoadingProfile(false));
    }
  }, [status, router]);

  if (status === "loading" || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0].toUpperCase() ?? "U";

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  const roleLabel = ROLE_LABELS[profile?.role ?? "USER"] ?? "Member";
  const roleColor = ROLE_COLORS[profile?.role ?? "USER"] ?? "bg-gray-100 text-gray-800";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="h-32 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 relative">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)" }} />
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Avatar + Info */}
        <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
            {profile?.image ? (
              <Image src={profile.image} alt={profile.name ?? ""} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-3xl font-bold">{initials}</span>
            )}
          </div>

          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile?.name ?? "User"}</h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleColor}`}>
                {roleLabel}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              {profile?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {joinedDate}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {profile?.email}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pb-1">
            <button
              onClick={() => router.push("/settings")}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Cats", value: profile?.cats?.length ?? 0, icon: Cat },
            { label: "Interests", value: profile?.interests?.length ?? 0, icon: Heart },
            { label: "Orders", value: 0, icon: ShoppingBag },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="flex justify-center mb-1">
                <Icon className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {(["cats", "interests", "orders"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "text-black border-b-2 border-black"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "cats" ? "My Cats" : tab === "interests" ? "Interests" : "Orders"}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Cats Tab */}
            {activeTab === "cats" && (
              <div>
                {profile?.cats && profile.cats.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.cats.map((cat) => (
                      <div key={cat.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-linear-to-br from-amber-200 to-orange-300 flex items-center justify-center shrink-0">
                          {cat.image ? (
                            <Image src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">🐱</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{cat.name}</p>
                          <p className="text-sm text-gray-400">
                            {[cat.breed, cat.age ? `${cat.age}yr` : null].filter(Boolean).join(" · ") || "No details yet"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-3">🐱</div>
                    <p className="text-gray-500 text-sm mb-4">No cats added yet</p>
                    <button className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium">
                      Add a Cat
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Interests Tab */}
            {activeTab === "interests" && (
              <div>
                {profile?.interests && profile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <span key={interest}
                        className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium capitalize">
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-3">💡</div>
                    <p className="text-gray-500 text-sm">No interests selected</p>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">🛍️</div>
                <p className="text-gray-500 text-sm mb-4">No orders yet</p>
                <button
                  onClick={() => router.push("/marketplace")}
                  className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium">
                  Browse Marketplace
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
}
