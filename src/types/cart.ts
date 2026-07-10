export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: CartProduct;
}