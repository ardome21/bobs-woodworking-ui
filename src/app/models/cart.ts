export interface CartItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  imageUrl: string;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
