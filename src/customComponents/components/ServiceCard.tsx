import { MapPin, Phone, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
interface ServiceCardProps {
  name: string;
  type: "vet" | "grooming" | "boarding";
  rating: number;
  distance: string;
  address: string;
  phone: string;
  image: string;
}

const serviceTypeColors = {
  vet: "bg-blue-100 text-blue-700",
  grooming: "bg-purple-100 text-purple-700",
  boarding: "bg-green-100 text-green-700"
};

const serviceTypeLabels = {
  vet: "Veterinary",
  grooming: "Grooming",
  boarding: "Boarding"
};

export function ServiceCard({ name, type, rating, distance, address, phone, image }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="md:flex">
        <div className="md:w-48 aspect-video md:aspect-square overflow-hidden bg-gray-50">
          <Image
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            width={400}
            height={350}
          />
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="mb-1">{name}</h3>
              <Badge className={serviceTypeColors[type]}>
                {serviceTypeLabels[type]}
              </Badge>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p>{address}</p>
                <p className="text-xs mt-0.5">{distance} away</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0" />
              <p>{phone}</p>
            </div>
          </div>
          <Button className="w-full md:w-auto">
            Book Appointment
          </Button>
        </div>
      </div>
    </Card>
  );
}
