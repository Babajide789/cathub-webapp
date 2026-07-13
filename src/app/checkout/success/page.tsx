"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/app/context/CartContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [cleared, clearCart]);

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
        </p>
        <Link href="/shop">
          <Button className="w-full">Continue Shopping</Button>
        </Link>
      </Card>
    </div>
  );
}