import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";

async function getProductPriceMap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load products");
  const products: { id: string; name: string; price: number; image: string }[] = await res.json();
  return new Map(products.map((p) => [p.id, p]));
}

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as {
      items: { productId: string; quantity: number }[];
    };

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productMap = await getProductPriceMap();

    const line_items = items.map(({ productId, quantity }) => {
      const product = productMap.get(productId);
      if (!product) throw new Error(`Product ${productId} not found`);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : undefined,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: Math.max(1, Math.min(10, quantity)),
      };
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "NG"] },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json({ error: "Unable to start checkout" }, { status: 500 });
  }
}