import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing checkout session" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "Order reference missing" }, { status: 404 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data:
        session.payment_status === "paid"
          ? {
              status: "PAID",
              providerSessionId: session.id,
              customerEmail: session.customer_details?.email ?? session.customer_email ?? undefined,
              paidAt: new Date(),
            }
          : { providerSessionId: session.id },
      include: { items: true },
    });

    return NextResponse.json({
      id: order.id,
      status: order.status,
      totalCents: order.totalCents,
      items: order.items,
    });
  } catch (error) {
    console.error("Checkout confirmation error:", error);
    return NextResponse.json({ error: "Unable to confirm checkout" }, { status: 500 });
  }
}
