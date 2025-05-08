"use client";

import { Button } from "@/components/ui/button";
// import CartItem from "@/components/store/CartItem"; // Use dynamic import
// import { useCart } from "@/lib/hooks/useCart"; // Remove old hook
import { useCartStore } from "@/lib/stores/cart"; // Import zustand store
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Import dynamic
import { formatPrice } from "@/lib/utils"; // Import formatPrice

// Dynamically import CartItemComponent to ensure it's client-side only
const CartItemComponent = dynamic(() => import("@/components/store/CartItem"), {
  ssr: false,
  loading: () => <div className="h-24 animate-pulse bg-gray-100 dark:bg-gray-800 rounded"></div> // Optional loading state
});

export default function CartPage() {
  // Use state and functions from zustand store
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Component has mounted, safe to access client-side state
    setHasMounted(true);
  }, []);

  // Calculate subtotal only after mounting
  const subtotal = hasMounted ? totalPrice() : 0;

  if (!hasMounted) {
    // Render a loading state during SSR/SSG and before hydration
    return <div className="container mx-auto px-4 py-8 text-center">Loading cart...</div>; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          <p>Your cart is empty.</p>
          <Link href="/products" legacyBehavior>
            <Button className="mt-4">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                // Pass handlers directly if needed, though CartItemComponent now uses the store
                // onRemove={() => removeItem(item.id)}
                // onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
              />
            ))}
             <Button variant="outline" onClick={clearCart} className="mt-4">Clear Cart</Button>
          </div>

          {/* Order Summary */}
          <div className="border dark:border-gray-700 rounded-lg p-6 h-fit bg-white dark:bg-gray-900 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Order Summary</h2>
            <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-500 dark:text-gray-400">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-500 dark:text-gray-400">
              <span>Taxes</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t dark:border-gray-700 pt-4 text-gray-900 dark:text-white">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Link href="/checkout" legacyBehavior>
               <Button className="w-full mt-6">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

