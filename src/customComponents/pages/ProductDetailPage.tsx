"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Minus, Plus, Package, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "../components/ProductCard";
import { mockProducts } from "../data/mockData";

export function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const product = mockProducts.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2>Product not found</h2>
        <Link href="/shop">
          <Button className="mt-4">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const relatedProducts = mockProducts.filter((p) => p.id !== id && p.category === product.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 md:top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link href="/shop">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Image */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="mb-4">
              <Badge variant="secondary" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="mb-3">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">
                  {product.reviews} reviews
                </span>
              </div>
              <div className="flex items-baseline gap-3 mb-6">
                <p className="text-3xl font-semibold">${product.price.toFixed(2)}</p>
                {!product.inStock && (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator className="my-6" />

            {/* Quantity and Add to Cart */}
            {product.inStock && (
              <div className="mb-6">
                <Label className="mb-3 block">Quantity</Label>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= 10}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Max 10 per order
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1" size="lg">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">In Stock</p>
                  <p className="text-xs text-muted-foreground">Ships within 24hrs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">30-Day Returns</p>
                  <p className="text-xs text-muted-foreground">Easy returns policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <Tabs defaultValue="reviews">
            <TabsList>
              <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="mt-6">
              <Card className="p-6">
                <div className="text-center py-8 text-muted-foreground">
                  <p>No reviews yet. Be the first to review this product!</p>
                  <Button className="mt-4">Write a Review</Button>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="specs" className="mt-6">
              <Card className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p className="font-medium">CatHub Premium</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SKU</p>
                    <p className="font-medium">CAT-{product.id.padStart(6, "0")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <p className="font-medium">{product.inStock ? "In Stock" : "Out of Stock"}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} {...relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ className, children, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  );
}
