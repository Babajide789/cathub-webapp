import { products } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(products);
}

// Optional: Get single product
export async function POST(req: Request) {
  const { id } = await req.json();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}