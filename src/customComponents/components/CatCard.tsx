"use client"

import Link from "next/link";
import { MapPin, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";


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
  return (
    <Link href={`/adopt/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              console.log("Add to favorites");
            }}
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
        </div>
      </Card>
    </Link>
  );
}
