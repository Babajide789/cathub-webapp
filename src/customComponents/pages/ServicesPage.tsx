"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, List as ListIcon, Map } from "lucide-react";
import { ServiceCard } from "../components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ✅ IMPORT TYPES
import {
  getServices,
  type GetServicesResponse,
} from "@/lib/api/services";

export function ServicesPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Filters
  const [location, setLocation] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [distance, setDistance] = useState("");
  const [page, setPage] = useState(1);

  // 🔥 Debounce
  const [debouncedLocation, setDebouncedLocation] = useState(location);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(location);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  // 🚀 React Query (✅ TYPED)
  const { data, isLoading } = useQuery<GetServicesResponse>({
    queryKey: ["services", page, debouncedLocation, selectedType, distance],
    queryFn: () =>
      getServices({
        page,
        location: debouncedLocation,
        type: selectedType,
        distance,
      }),
    placeholderData: (prev) => prev,
  });

  const services = data?.services || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 py-8 md:py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="mb-2">Veterinary & Pet Services</h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `Found ${services.length} services`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Location */}
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                placeholder="Enter your location..."
                className="pl-10"
              />
            </div>

            {/* Distance */}
            <Select
              onValueChange={(value) => {
                setDistance(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Within 5 miles</SelectItem>
                <SelectItem value="10">Within 10 miles</SelectItem>
                <SelectItem value="25">Within 25 miles</SelectItem>
                <SelectItem value="50">Within 50 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs + View */}
          <div className="flex items-center justify-between">
            <Tabs
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value);
                setPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="all">All Services</TabsTrigger>
                <TabsTrigger value="vet">Veterinary</TabsTrigger>
                <TabsTrigger value="grooming">Grooming</TabsTrigger>
                <TabsTrigger value="boarding">Boarding</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="w-4 h-4 mr-2" />
                List
              </Button>

              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                <Map className="w-4 h-4 mr-2" />
                Map
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          )
        ) : (
          <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <Map className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-muted-foreground">
                Map view coming soon
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}