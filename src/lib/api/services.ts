// src/lib/api/services.ts

export interface GetServicesParams {
  page?: number;
  location?: string;
  type?: string;
  distance?: string;
}

export async function getServices(params: GetServicesParams) {
  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));
  if (params.location) query.append("location", params.location);
  if (params.type && params.type !== "all") query.append("type", params.type);
  if (params.distance) query.append("distance", params.distance);

  const res = await fetch(`/api/services?${query.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
}

export interface Service {
  id: string;
  name: string;
  type: "vet" | "grooming" | "boarding";
  rating: number;
  distance: string;
  address: string;
  phone: string;
  image: string;
}

export interface GetServicesResponse {
  services: Service[];
}