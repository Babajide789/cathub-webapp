"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useCart } from "@/app/context/CartContext";

export function CartPage() {
  const { cart, updateQuantity, removeItem } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Unable to start checkout");
      }

      const { url } = await res.json();
      window.location.href = url; // redirect to Stripe-hosted Checkout page
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Something went wrong");
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some items to get started!</p>
          <Link href="/shop">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b sticky top-0 md:top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link href="/shop">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8">Shopping Cart ({cart.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.productId} className="p-4">
                <div className="flex gap-4">
                  <Link href={`/shop/${item.productId}`} className="shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        width={96}
                        height={96}
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.productId}`}>
                      <h3 className="mb-1 line-clamp-2 hover:text-primary transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.product.category && (
                      <p className="text-sm text-muted-foreground mb-3">{item.product.category}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, 1)}
                          disabled={item.quantity >= 10}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <h3 className="mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-semibold">${total.toFixed(2)}</span>
                </div>

                {checkoutError && <p className="text-sm text-destructive mb-3">{checkoutError}</p>}

                <Button className="w-full mb-3" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>

                {shipping > 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                <Separator className="my-6" />

                <div>
                  <h4 className="mb-3">Promo Code</h4>
                  <div className="flex gap-2">
                    <Input placeholder="Enter code" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </Card>

              <Card className="p-4 mt-4 bg-blue-50 border-blue-100">
                <div className="flex items-start gap-3">
                  <ShoppingBag className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Free Shipping</p>
                    <p className="text-blue-700">On all orders over $50</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}