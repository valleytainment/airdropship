// src/types/index.ts

// Matching schemas.py ProductPublic
export interface Product {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  category?: string | null;
  tags?: string | null;
  stock_level?: number | null;
  // Add other fields as needed from ProductPublic
}

// Matching schemas.py ProductListResponse
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  size: number;
}

// Matching schemas.py OrderItemCreate
export interface CartItemCreate {
  product_id: number;
  quantity: number;
  price_per_unit: number; // Price at time of adding to cart
}

// Interface for item in the cart state
export interface CartItem extends CartItemCreate {
  product: Product; // Include full product details for display
}

// Matching schemas.py OrderCreate
export interface OrderCreatePayload {
  customer_email: string;
  customer_name?: string | null;
  shipping_address: string;
  items: CartItemCreate[];
  // payment_token: string; // Add this when integrating payment
}

// Matching schemas.py OrderItemPublic
export interface OrderItemPublic extends CartItemCreate {
  id: number;
  product: Product;
}

// Matching schemas.py OrderPublic
export interface Order {
  id: number;
  customer_email: string;
  customer_name?: string | null;
  shipping_address: string;
  total_amount: number;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  tracking_number?: string | null;
  created_at: string; // ISO date string
  items: OrderItemPublic[];
}

