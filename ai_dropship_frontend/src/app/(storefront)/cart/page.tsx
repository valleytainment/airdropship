// src/app/(storefront)/cart/page.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/lib/hooks/useCart";
import CartItemComponent from "@/components/store/CartItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { cartItems, cartItemCount, cartTotal, clearCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

      {cartItemCount > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Items ({cartItemCount})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col divide-y">
                  {cartItems.map((item) => (
                    <CartItemComponent key={item.product_id} item={item} className="px-6" />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 justify-end">
                 <Button variant="outline" onClick={clearCart} size="sm">
                    Clear Cart
                 </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Estimated Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-16 border rounded-lg bg-muted">
          <ShoppingCart className="h-20 w-20 text-muted-foreground" strokeWidth={1} />
          <p className="text-xl font-medium text-muted-foreground">Your cart is empty</p>
          <Button variant="default" asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

