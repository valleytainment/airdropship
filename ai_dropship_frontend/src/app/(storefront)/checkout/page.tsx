// src/app/(storefront)/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import apiClient from "@/lib/apiClient";
import { OrderCreatePayload, CartItemCreate } from "@/types";
// import { useToast } from "@/components/ui/use-toast"; // If using toasts for feedback

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  // const { toast } = useToast(); // If using toasts

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      setIsLoading(false);
      return;
    }

    const orderItems: CartItemCreate[] = cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price_per_unit: item.price_per_unit,
    }));

    const payload: OrderCreatePayload = {
      customer_email: email,
      customer_name: name || undefined,
      shipping_address: address,
      items: orderItems,
      // payment_token: "placeholder_token", // Add actual payment token later
    };

    try {
      const response = await apiClient.post("/orders/storefront", payload);
      const createdOrder = response.data;
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to order confirmation page
      router.push(`/order-confirmation/${createdOrder.id}`);
      
      // Optional: Show success toast
      // toast({ title: "Order Placed!", description: `Your order #${createdOrder.id} has been confirmed.` });

    } catch (err: any) {
      console.error("Failed to place order:", err);
      setError(err.response?.data?.detail || "An unexpected error occurred. Please try again.");
      // Optional: Show error toast
      // toast({ variant: "destructive", title: "Order Failed", description: error });
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0 && !isLoading) {
    // Redirect to cart page or show message if cart becomes empty during checkout
    // For simplicity, showing a message here.
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Checkout</h1>
            <p className="text-muted-foreground">Your cart is empty. Please add items before proceeding to checkout.</p>
            <Button asChild className="mt-4">
                <a href="/products">Continue Shopping</a>
            </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Shipping & Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Shipping Address</Label>
                  <Input id="address" type="text" placeholder="123 Main St, City, Country" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  {/* Expand address fields as needed (street, city, zip, country) */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Placeholder for Payment Integration (e.g., Stripe Elements) */}
                <div className="border rounded-md p-4 bg-muted text-muted-foreground text-center">
                  Payment gateway integration placeholder.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.product_id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.quantity} x</span>
                      <span className="line-clamp-1 text-muted-foreground">{item.product.title}</span>
                    </div>
                    <span>{formatPrice(item.price_per_unit * item.quantity)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span> {/* Placeholder */}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes</span>
                  <span>Calculated</span> {/* Placeholder */}
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span> {/* Add shipping/taxes later */}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                 {error && <p className="text-sm text-destructive text-center">{error}</p>}
                 <Button type="submit" size="lg" className="w-full" disabled={isLoading || cartItems.length === 0}>
                   {isLoading ? "Placing Order..." : "Place Order"}
                 </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

