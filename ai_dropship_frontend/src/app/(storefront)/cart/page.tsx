
"use client";

import { Button } from "@/components/ui/button";
import CartItem from "@/components/store/CartItem";
import { useCart } from "@/lib/hooks/useCart";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this component only renders client-side where localStorage is available
    setIsClient(true);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isClient) {
    // Render nothing or a loading state during SSR/SSG
    return null; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Your cart is empty.</p>
          <Link href="/" legacyBehavior>
            <Button className="mt-4">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
              />
            ))}
             <Button variant="outline" onClick={clearCart} className="mt-4">Clear Cart</Button>
          </div>

          {/* Order Summary */}
          <div className="border rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-500">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-500">
              <span>Taxes</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
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

