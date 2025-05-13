"use client";

import { useCartStore } from "@/lib/stores/cart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

// Ensure this is your actual Stripe Publishable Key, or use an environment variable
// For now, using the placeholder as discussed.
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "<your_stripe_publishable_key_here>";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const { items: cartItems, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = totalPrice();

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      setIsLoading(false);
      return;
    }

    if (STRIPE_PUBLISHABLE_KEY === "<your_stripe_publishable_key_here>") {
        console.warn("Stripe Publishable Key is a placeholder. Real payments will not work.");
        // Optionally, you could prevent checkout or show a more prominent warning to the user.
    }

    // Prepare line items for Stripe (ensure price is in cents)
    const lineItems = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: Math.round(item.price * 100), // Convert to cents and ensure integer
      quantity: item.quantity,
    }));

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lineItems),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create checkout session.");
      }

      const session = await response.json();
      const stripe = await stripePromise;

      if (stripe && session.sessionId) {
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
        if (stripeError) {
          console.error("Stripe redirection error:", stripeError);
          setError(stripeError.message || "Failed to redirect to Stripe.");
        }
      } else {
        throw new Error("Stripe.js failed to load or session ID missing.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "An unexpected error occurred during checkout.");
    }

    setIsLoading(false);
  };

  return (
    <div className="checkout container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="cart-items space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="cart-item flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            )}
            {cartItems.length > 0 && (
              <div className="text-right font-bold text-lg mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                Total: ${totalAmount.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Proceed to Payment</h2>
          {error && <p className="text-red-500 mb-4">Error: {error}</p>}
          {STRIPE_PUBLISHABLE_KEY === "<your_stripe_publishable_key_here>" && 
            <p className="text-orange-500 mb-4 p-2 border border-orange-500 rounded-md bg-orange-50 dark:bg-orange-900/30">
                <strong>Note:</strong> Stripe is using a placeholder key. Real payments will not be processed. Replace with your actual Stripe Publishable Key for live functionality.
            </p>
          }
          <Button 
            onClick={handleCheckout} 
            className="w-full mt-4" 
            disabled={isLoading || cartItems.length === 0}
          >
            {isLoading ? "Processing..." : "Pay with Stripe"}
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            You will be redirected to Stripe to complete your payment securely.
          </p>
        </div>
      </div>
    </div>
  );
}

