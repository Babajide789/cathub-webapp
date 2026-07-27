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
  createdAt: string;
  cats: { id: string; name: string; breed: string | null; age: number | null; image: string | null }[];
  orders: {
    id: string;
    status: string;
    totalCents: number;
    currency: string;
    createdAt: string;
    items: { id: string; name: string; quantity: number; totalCents: number }[];
  }[];
  savedPictures: { id: string; image: string; caption: string | null; source: string | null; createdAt: string }[];
  savedCats: {
    catId: string;
    name: string;
    breed: string | null;
    age: string | null;
    image: string | null;
    location: string | null;
    savedAt: string | null;
  }[];
  savedProducts: { productId: string }[];
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
  const [activeTab, setActiveTab] = useState<"cats" | "favorites" | "pictures" | "orders">("cats");
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => setProfile(data))
        .finally(() => setLoadingProfile(false));
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
    ? profile.name.split(" ").map((name) => name[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0].toUpperCase() ?? "U";
  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";
  const roleLabel = ROLE_LABELS[profile?.role ?? "USER"] ?? "Member";
  const roleColor = ROLE_COLORS[profile?.role ?? "USER"] ?? "bg-gray-100 text-gray-800";
  const savedCount =
    (profile?.savedPictures?.length ?? 0) +
    (profile?.savedProducts?.length ?? 0) +
    (profile?.savedCats?.length ?? 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-32 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 relative">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
            {profile?.image ? (
              <Image src={profile.image} alt={profile.name ?? ""} className="w-full h-full object-cover" width={112} height={112} />
            ) : (
              <span className="text-white text-3xl font-bold">{initials}</span>
            )}
          </div>

          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile?.name ?? "User"}</h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleColor}`}>{roleLabel}</span>
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
              onClick={() => setConfirmingSignOut(true)}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Cats", value: profile?.cats?.length ?? 0, icon: Cat },
            { label: "Saved", value: savedCount, icon: Heart },
            { label: "Orders", value: profile?.orders?.length ?? 0, icon: ShoppingBag },
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {(["cats", "favorites", "pictures", "orders"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === tab ? "text-black border-b-2 border-black" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "cats"
                  ? "My Cats"
                  : tab === "favorites"
                    ? "Favorite Cats"
                    : tab === "pictures"
                      ? "Saved Pictures"
                      : "Orders"}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "cats" && (
              <div>
                {profile?.cats && profile.cats.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.cats.map((cat) => (
                      <div key={cat.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-linear-to-br from-amber-200 to-orange-300 flex items-center justify-center shrink-0">
                          {cat.image ? (
                            <Image src={cat.image} alt={cat.name} className="w-full h-full object-cover" width={56} height={56} />
                          ) : (
                            <span className="text-2xl">+</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{cat.name}</p>
                          <p className="text-sm text-gray-400">
                            {[cat.breed, cat.age ? `${cat.age}yr` : null].filter(Boolean).join(" / ") || "No details yet"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-3">+</div>
                    <p className="text-gray-500 text-sm mb-4">No cats added yet</p>
                    <button className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium">Add a Cat</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                {profile?.savedCats && profile.savedCats.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.savedCats.map((cat) => (
                      <button
                        key={cat.catId}
                        onClick={() => router.push(`/adopt/${cat.catId}`)}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-left transition hover:bg-gray-100"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-linear-to-br from-rose-100 to-amber-200 flex items-center justify-center shrink-0">
                          {cat.image ? (
                            <Image src={cat.image} alt={cat.name} className="w-full h-full object-cover" width={56} height={56} />
                          ) : (
                            <Heart className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{cat.name}</p>
                          <p className="truncate text-sm text-gray-400">
                            {[cat.breed, cat.age, cat.location].filter(Boolean).join(" / ") || "No details yet"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Heart className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-gray-500 text-sm mb-4">No favorite cats yet</p>
                    <button onClick={() => router.push("/adopt")} className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium">
                      Browse Cats
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "pictures" && (
              <div>
                {profile?.savedPictures && profile.savedPictures.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {profile.savedPictures.map((picture) => (
                      <div key={picture.id} className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                        <div className="relative aspect-square">
                          <Image src={picture.image} alt={picture.caption ?? "Saved picture"} className="object-cover" fill />
                        </div>
                        {picture.caption && <p className="line-clamp-2 p-3 text-xs text-gray-500">{picture.caption}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-3">+</div>
                    <p className="text-gray-500 text-sm">No saved pictures yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                {profile?.orders && profile.orders.length > 0 ? (
                  <div className="space-y-3">
                    {profile.orders.map((order) => (
                      <div key={order.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900">Order {order.id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {(order.totalCents / 100).toLocaleString("en-US", {
                                style: "currency",
                                currency: order.currency.toUpperCase(),
                              })}
                            </p>
                            <p className="text-xs uppercase text-gray-400">{order.status}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-3">+</div>
                    <p className="text-gray-500 text-sm mb-4">No orders yet</p>
                    <button onClick={() => router.push("/shop")} className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium">
                      Browse Shop
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="h-12" />
      </div>

      {confirmingSignOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-950">Sign out of CatHub?</h2>
            <p className="mt-2 text-sm text-gray-500">
              You will need to sign in again before posting, messaging, saving cats, or checking out.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmingSignOut(false)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Stay signed in
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
