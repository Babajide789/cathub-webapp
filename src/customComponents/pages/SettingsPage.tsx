"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Cat,
  Check,
  ChevronRight,
  Heart,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  RefreshCcw,
  Save,
  Shield,
  User,
} from "lucide-react";
import Image from "next/image";

type UserPreferences = {
  notifyAdoption: boolean;
  notifyMarketplace: boolean;
  notifyMating: boolean;
  notifyVets: boolean;
};

type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  location: string | null;
  role: string;
  interests: string[];
  hasOnboarded: boolean;
  createdAt: string;
  preferences: UserPreferences | null;
  cats: {
    id: string;
    name: string;
    breed: string | null;
    age: number | null;
    image: string | null;
  }[];
};

type SettingsForm = {
  name: string;
  location: string;
  image: string;
  role: string;
  interestsText: string;
  preferences: UserPreferences;
};

const DEFAULT_PREFERENCES: UserPreferences = {
  notifyAdoption: false,
  notifyMarketplace: false,
  notifyMating: false,
  notifyVets: false,
};

const ROLE_OPTIONS = [
  { value: "USER", label: "Member" },
  { value: "OWNER", label: "Cat Owner" },
  { value: "BUYER", label: "Buyer" },
  { value: "SELLER", label: "Seller" },
  { value: "SERVICE_PROVIDER", label: "Service Provider" },
];

const NOTIFICATION_OPTIONS: {
  key: keyof UserPreferences;
  label: string;
  description: string;
}[] = [
  {
    key: "notifyAdoption",
    label: "Adoption updates",
    description: "New adoption activity and cat availability.",
  },
  {
    key: "notifyMarketplace",
    label: "Marketplace deals",
    description: "Product drops, offers, and order updates.",
  },
  {
    key: "notifyMating",
    label: "Mating requests",
    description: "Messages and matches related to breeding.",
  },
  {
    key: "notifyVets",
    label: "Vet availability",
    description: "Care provider openings and appointment notices.",
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const { status, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<SettingsForm>(createEmptyForm());
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status !== "authenticated") return;

    let isActive = true;

    async function loadProfile() {
      setLoadingProfile(true);
      setError("");

      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error ?? "Unable to load settings.");
        }

        if (!isActive) return;
        setProfile(data);
        setForm(createFormFromProfile(data));
      } catch (err) {
        if (!isActive) return;
        setError(
          err instanceof Error ? err.message : "Unable to load settings."
        );
      } finally {
        if (isActive) setLoadingProfile(false);
      }
    }

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [router, status]);

  const initials = useMemo(() => getInitials(profile?.name, profile?.email), [
    profile?.email,
    profile?.name,
  ]);

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  const interests = form.interestsText
    .split(",")
    .map((interest) => interest.trim())
    .filter(Boolean);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          location: form.location,
          image: form.image,
          role: form.role,
          interests,
          preferences: form.preferences,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Unable to save settings.");
      }

      setProfile(data);
      setForm(createFormFromProfile(data));
      await update();
      setSuccess("Settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loadingProfile) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-10 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
          <p className="text-sm text-gray-500">Loading settings...</p>
        </div>
      </main>
    );
  }

  if (!profile && error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <section className="mx-auto max-w-xl rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Account</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
              Settings
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-100"
            >
              View profile
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmingSignOut(true)}
              className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <SectionHeader
                icon={<User className="h-5 w-5" />}
                title="Profile information"
                description="These details power your CatHub profile and account display."
              />
              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <Field label="Full name" icon={<User className="h-4 w-4" />}>
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    placeholder="Your name"
                  />
                </Field>
                <Field label="Email address" icon={<Mail className="h-4 w-4" />}>
                  <input
                    value={profile?.email ?? ""}
                    disabled
                    className="h-11 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500"
                  />
                </Field>
                <Field label="Location" icon={<MapPin className="h-4 w-4" />}>
                  <input
                    value={form.location}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        location: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    placeholder="City, state"
                  />
                </Field>
                <Field label="Role" icon={<Shield className="h-4 w-4" />}>
                  <select
                    value={form.role}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        role: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field
                    label="Profile image URL"
                    icon={<ImageIcon className="h-4 w-4" />}
                  >
                    <input
                      value={form.image}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          image: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                      placeholder="https://..."
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <SectionHeader
                icon={<Heart className="h-5 w-5" />}
                title="Interests"
                description="Separate interests with commas."
              />
              <div className="space-y-4 p-5">
                <textarea
                  value={form.interestsText}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      interestsText: event.target.value,
                    }))
                  }
                  className="min-h-28 w-full resize-y rounded-md border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  placeholder="adoption, marketplace, vets"
                />
                <div className="flex flex-wrap gap-2">
                  {interests.length ? (
                    interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium capitalize text-white"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No interests selected.
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <SectionHeader
                icon={<Bell className="h-5 w-5" />}
                title="Notifications"
                description="Choose which CatHub email notifications you receive."
              />
              <div className="divide-y divide-gray-100">
                {NOTIFICATION_OPTIONS.map((option) => (
                  <label
                    key={option.key}
                    className="flex cursor-pointer items-center justify-between gap-4 p-5 transition hover:bg-gray-50"
                  >
                    <span>
                      <span className="block text-sm font-medium text-gray-950">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        {option.description}
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={form.preferences[option.key]}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          preferences: {
                            ...current.preferences,
                            [option.key]: event.target.checked,
                          },
                        }))
                      }
                      className="h-5 w-5 rounded border-gray-300 text-gray-900 accent-gray-900"
                    />
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-900 text-lg font-bold text-white">
                  {form.image ? (
                    <Image
                      src={form.image}
                      alt={form.name || "Profile avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-gray-950">
                    {form.name || "Unnamed user"}
                  </h2>
                  <p className="truncate text-sm text-gray-500">
                    {profile?.email}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Joined {joinedDate}
                  </p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <SummaryCard
                label="Cats"
                value={profile?.cats.length ?? 0}
                icon={<Cat className="h-5 w-5" />}
              />
              <SummaryCard
                label="Interests"
                value={interests.length}
                icon={<Heart className="h-5 w-5" />}
              />
            </section>

            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5">
                <h2 className="text-sm font-semibold text-gray-950">Cats</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {profile?.cats.length ? (
                  profile.cats.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-3 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 text-gray-500">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Cat className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-950">
                          {cat.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {[cat.breed, cat.age ? `${cat.age} yr` : null]
                            .filter(Boolean)
                            .join(" · ") || "No details yet"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 text-sm text-gray-500">
                    No cats added yet.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              {error && (
                <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              {success && (
                <p className="mb-3 inline-flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  <Check className="h-4 w-4" />
                  {success}
                </p>
              )}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save settings"}
              </button>
            </section>
          </aside>
        </form>
      </div>

      {confirmingSignOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-950">Sign out of CatHub?</h2>
            <p className="mt-2 text-sm text-gray-500">
              Stay signed in to keep posting, messaging, saving cats, and checking out without interruption.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmingSignOut(false)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Stay signed in
              </button>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function createEmptyForm(): SettingsForm {
  return {
    name: "",
    location: "",
    image: "",
    role: "USER",
    interestsText: "",
    preferences: DEFAULT_PREFERENCES,
  };
}

function createFormFromProfile(profile: UserProfile): SettingsForm {
  return {
    name: profile.name ?? "",
    location: profile.location ?? "",
    image: profile.image ?? "",
    role: profile.role || "USER",
    interestsText: profile.interests.join(", "),
    preferences: {
      ...DEFAULT_PREFERENCES,
      ...(profile.preferences ?? {}),
    },
  };
}

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return email?.[0]?.toUpperCase() ?? "U";
}

function Field({
  children,
  icon,
  label,
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-800">
        <span className="text-gray-400">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

function SectionHeader({
  description,
  icon,
  title,
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="border-b border-gray-100 p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-gray-400">{icon}</div>
        <div>
          <h2 className="text-base font-semibold text-gray-950">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-gray-400">{icon}</div>
      <p className="text-2xl font-bold text-gray-950">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
    </div>
  );
}
