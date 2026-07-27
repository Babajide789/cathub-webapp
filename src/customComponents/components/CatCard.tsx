"use client"

import Link from "next/link";
import { MapPin, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export interface CatCardProps {
  id: string;
  name: string;
  age: string;
  breed: string;
  location: string;
  image: string;
  gender: string;
}

export function CatCard({ id, name, age, breed, location, image, gender }: CatCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleFavorite() {
    if (!session?.user) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent("/adopt")}`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/saved-cats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catId: id }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Unable to save cat");
      }

      setToast(`${name} added to favorites`);
      window.setTimeout(() => setToast(""), 2400);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Unable to save cat");
      window.setTimeout(() => setToast(""), 2400);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Link href={`/adopt/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={name}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fill
          />
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors disabled:opacity-60"
            disabled={saving}
            onClick={(e) => {
              e.preventDefault();
              handleFavorite();
            }}
            aria-label={`Save ${name}`}
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <Badge className="absolute top-3 left-3 bg-white/90 text-foreground hover:bg-white">
            {gender}
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{breed} • {age}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
          {toast && (
            <div className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {toast}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
