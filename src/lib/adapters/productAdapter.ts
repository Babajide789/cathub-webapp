import type { CartProduct } from "@/types/cart";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
};

export function mapProductToCart(product: ProductCardProps): CartProduct {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
  };
}