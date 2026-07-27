import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { products } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/server";

const CART_LIMIT = 10;
const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const SHIPPING_CENTS = 599;
const TAX_RATE = 0.08;

function getBaseUrl(req: Request) {
  const configured = process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) return configured.replace(/\/$/, "");

  const origin = req.headers.get("origin");
  if (origin) return origin;

  const host = req.headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  return host ? `${protocol}://${host}` : "http://localhost:3000";
}

export async function POST(req: Request) {
  try {
    const sessionUser = (await getServerSession(authOptions))?.user;
    const { items } = (await req.json()) as {
      items: { productId: string; quantity: number }[];
    };

    if (!sessionUser?.id) {
      return NextResponse.json({ error: "Sign in to checkout" }, { status: 401 });
    }

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    const orderItems = items.map(({ productId, quantity }) => {
      const product = productMap.get(productId);
      if (!product) throw new Error(`Product ${productId} not found`);
      if (!product.inStock) throw new Error(`${product.name} is out of stock`);

      const safeQuantity = Math.max(1, Math.min(CART_LIMIT, Number(quantity) || 1));
      const unitCents = Math.round(product.price * 100);

      return {
        product,
        quantity: safeQuantity,
        unitCents,
        totalCents: unitCents * safeQuantity,
      };
    });

    const subtotalCents = orderItems.reduce((sum, item) => sum + item.totalCents, 0);
    const shippingCents =
      subtotalCents === 0 || subtotalCents > FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;
    const taxCents = Math.round(subtotalCents * TAX_RATE);
    const totalCents = subtotalCents + shippingCents + taxCents;

    const order = await prisma.order.create({
      data: {
        userId: sessionUser?.id,
        customerEmail: sessionUser?.email ?? null,
        subtotalCents,
        shippingCents,
        taxCents,
        totalCents,
        items: {
          create: orderItems.map(({ product, quantity, unitCents, totalCents }) => ({
            productId: product.id,
            name: product.name,
            image: product.image,
            category: product.category,
            quantity,
            unitCents,
            totalCents,
          })),
        },
      },
    });

    const line_items = orderItems.map(({ product, quantity, unitCents }) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : undefined,
          },
          unit_amount: unitCents,
        },
        quantity,
      }));

    if (shippingCents > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Shipping", images: undefined },
          unit_amount: shippingCents,
        },
        quantity: 1,
      });
    }

    if (taxCents > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Estimated tax", images: undefined },
          unit_amount: taxCents,
        },
        quantity: 1,
      });
    }

    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      customer_email: sessionUser?.email ?? undefined,
      metadata: {
        orderId: order.id,
        userId: sessionUser?.id ?? "",
      },
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "NG"] },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { providerSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    const message = err instanceof Error ? err.message : "Unable to start checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
