// src/types/index.ts

// Define the core Product type based on actual usage in components
export interface ProductPublic {
  id: string; // Used as key and in cart
  internal_id?: number; // Original ID if needed
  name: string; // Display name
  title?: string; // Alternative name field if exists
  description?: string | null;
  ai_description?: string | null; // AI generated description
  price: number;
  current_retail_price?: number | null; // Alternative price field
  image?: string | null; // Primary image or comma-separated list
  images?: string | null; // Alternative image field
  slug: string; // Used for product page URLs
  category?: string | null;
  tags?: string | null;
  stock_level?: number | null;
  variants?: string | null; // JSON string or structured object - handle parsing in component
  // Add any other fields that are actually used
}

// Cart Item type, extending ProductPublic
export interface CartItem extends ProductPublic {
  quantity: number;
}


// --- Original types below - keep for reference or potential backend alignment ---

// Matching schemas.py ProductPublic (Original - might differ from frontend usage)
export interface Product_Original {
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
  products: Product_Original[];
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

// Interface for item in the cart state (Original)
// export interface CartItem_Original extends CartItemCreate {
//   product: Product_Original; // Include full product details for display
// }

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
  product: Product_Original;
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

