// src/app/api/cats/route.ts

import { NextResponse } from "next/server";
import { cats } from "@/lib/data"; // ← your moved mock data

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search")?.toLowerCase() || "";
  const breed = searchParams.get("breed");
  const age = searchParams.get("age");
  const gender = searchParams.get("gender");

  const pageSize = 6;

  let filtered = [...cats];

  // 🔍 Search
  if (search) {
    filtered = filtered.filter((cat) =>
      cat.name.toLowerCase().includes(search)
    );
  }

  // 🐱 Breed
  if (breed && breed !== "all") {
    filtered = filtered.filter((cat) => cat.breed === breed);
  }

  // 🎂 Age
  if (age && age !== "all") {
    filtered = filtered.filter((cat) => cat.age === age);
  }

  // ⚧ Gender
  if (gender && gender !== "all") {
    filtered = filtered.filter((cat) => cat.gender === gender);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return NextResponse.json({
    cats: paginated,
    totalPages,
  });
}