"use client"

import { ShoppingCart, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { mapProductToCart } from "@/lib/adapters/productAdapter";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export function ProductCard({ id, name, price, category, image, rating, reviews, inStock }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link href={`/shop/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={400}
            height={350}
          />
          {!inStock && (
            <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
              Out of Stock
            </Badge>
          )}
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{category}</p>
        <Link href={`/shop/${id}`}>
          <h3 className="mb-2 line-clamp-2 hover:text-primary transition-colors">{name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">${price.toFixed(2)}</p>
          <Button
            size="sm"
            disabled={!inStock}
            onClick={(e) => {
              e.preventDefault();

              addToCart(
                mapProductToCart({
                  id,
                  name,
                  price,
                  image,
                  category,
                  rating,
                  reviews,
                  inStock,
                })
              );
            }}
          >
  <ShoppingCart className="w-4 h-4 mr-2" />
  Add
</Button>
        </div>
      </div>
    </Card>
  );
}
