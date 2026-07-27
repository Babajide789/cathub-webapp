import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <XCircle className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
        <h1 className="mb-2">Checkout canceled</h1>
        <p className="text-muted-foreground mb-6">Your payment was not completed. Your cart is still saved.</p>
        <Link href="/cart">
          <Button className="w-full">Return to Cart</Button>
        </Link>
      </Card>
    </div>
  );
}
