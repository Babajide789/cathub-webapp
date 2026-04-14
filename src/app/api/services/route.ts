// /app/api/services/route.ts

import { NextRequest, NextResponse } from "next/server";
import { services } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = Number(searchParams.get("page") || "1");
  const type = searchParams.get("type");
  const location = searchParams.get("location");
  const distance = Number(searchParams.get("distance") || "0");

  let filtered = [...services];

  // 🔍 Filter by type
  if (type && type !== "all") {
    filtered = filtered.filter((s) => s.type === type);
  }

  // 🔍 Filter by location (simple contains)
  if (location) {
    filtered = filtered.filter((s) =>
      s.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  // 🔍 Fake distance filter (for now)
  if (distance) {
    filtered = filtered.map((s) => ({
      ...s,
      distance: Math.floor(Math.random() * distance) + " miles",
    }));
  } else {
    filtered = filtered.map((s) => ({
      ...s,
      distance: Math.floor(Math.random() * 50) + " miles",
    }));
  }

  // 📄 Pagination
  const pageSize = 6;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    services: paginated,
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / pageSize),
  });
}