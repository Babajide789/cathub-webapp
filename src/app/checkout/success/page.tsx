"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/app/context/CartContext";

function CheckoutSuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const cleared = useRef(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!cleared.current) {
      clearCart();
      cleared.current = true;
    }
  }, [clearCart]);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => setOrderStatus(data.status ?? null))
      .catch(() => setOrderStatus(null));
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
        <h1 className="mb-2">Payment successful</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your order! A confirmation has been sent to your email.
          {sessionId && (
            <span className="block text-xs mt-2 text-muted-foreground/70">Reference: {sessionId}</span>
          )}
          {sessionId && !orderStatus && (
            <span className="mt-3 flex items-center justify-center gap-2 text-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Confirming your order...
            </span>
          )}
          {orderStatus === "PAID" && (
            <span className="block mt-3 text-sm text-green-700">Order confirmed.</span>
          )}
        </p>
        <Link href="/shop">
          <Button className="w-full">Continue Shopping</Button>
        </Link>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
