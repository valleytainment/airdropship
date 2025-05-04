"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/hooks/useCart";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react"; // Import useMemo
import apiClient from "@/lib/apiClient";
import { OrderCreate, OrderItemCreate, OrderPublic } from "@/types"; // Assuming types are defined

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Add state for form fields if needed for validation/submission
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate totals only when on client and cart is available
  const { subtotal, shipping, tax, total } = useMemo(() => {
    if (!isClient) {
      return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    }
    const calculatedSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const calculatedShipping = calculatedSubtotal > 0 ? 5.00 : 0; // Dummy shipping
    const calculatedTax = calculatedSubtotal * 0.08; // Dummy tax
    const calculatedTotal = calculatedSubtotal + calculatedShipping + calculatedTax;
    return {
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      tax: calculatedTax,
      total: calculatedTotal,
    };
  }, [cart, isClient]);

  const handlePlaceOrder = async () => {
    if (!email || !address) { // Basic validation
        setError("Please fill in all required fields.");
        return;
    }
    setIsLoading(true);
    setError(null);

    // Prepare order data for the backend
    const orderItems: OrderItemCreate[] = cart.map(item => ({
      product_id: parseInt(item.id, 10), // Ensure product_id is number
      quantity: item.quantity,
      price_per_unit: item.price, // Send price used in cart
    }));

    const orderData: OrderCreate = {
      customer_email: email,
      customer_name: name || undefined, // Optional field
      shipping_address: address,
      items: orderItems,
      // payment_token: "dummy-token" // In real app, get this from payment gateway
    };

    try {
      // Send order to backend API
      const response = await apiClient.post<OrderPublic>("/orders/storefront", orderData);
      const createdOrder = response.data;

      console.log("Order placed successfully:", createdOrder);

      // Clear cart after successful order
      clearCart();

      // Redirect to order confirmation page using the correct route
      // Note: We renamed the route segment earlier
      router.push(`/order-confirmation/${createdOrder.id}`);

    } catch (err: any) {
      console.error("Failed to place order:", err);
      setError(err.response?.data?.detail || "Failed to place order. Please try again.");
      setIsLoading(false);
    } 
    // No finally block for setIsLoading(false) because of redirect
  };

  if (!isClient) {
    // Render loading state during SSR/SSG
    return <div className="container mx-auto px-4 py-8 text-center">Loading checkout...</div>;
  }

  if (cart.length === 0) { // No need to check isClient here, as we already returned if !isClient
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Your cart is empty. Cannot proceed to checkout.</p>
        <Link href="/" legacyBehavior>
           <Button className="mt-4">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Shipping & Payment Form */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
             <div className="sm:col-span-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
             <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
             <div className="sm:col-span-2">
              <Label htmlFor="address">Shipping Address *</Label>
              <Input id="address" placeholder="123 Main St, Anytown, CA 90210" value={address} onChange={(e) => setAddress(e.target.value)} required />
              {/* Add more address fields if needed */}
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <div className="border rounded-lg p-6 bg-gray-50 text-gray-500 mb-6">
            Payment gateway integration (e.g., Stripe Elements) would go here.
            For now, clicking "Place Order" will simulate a successful order using the backend API.
          </div>
           {error && <p className="text-red-500 mb-4">Error: {error}</p>}
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
             <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Taxes</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full mt-6" onClick={handlePlaceOrder} disabled={isLoading}>
            {isLoading ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}

