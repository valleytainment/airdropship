// src/components/layout/CartSheet.tsx
"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import CartItemComponent from "@/components/store/CartItem";
import { formatPrice } from "@/lib/utils";

interface CartSheetProps {
  children: React.ReactNode; // The trigger element
}

const CartSheet = ({ children }: CartSheetProps) => {
  const { cartItems, cartItemCount, cartTotal } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Cart {cartItemCount > 0 && `(${cartItemCount})`}</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItemCount > 0 ? (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col divide-y">
                {cartItems.map((item) => (
                  <CartItemComponent key={item.product_id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="flex flex-col space-y-4 px-6 py-4">
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>{formatPrice(cartTotal)}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <SheetClose asChild>
                 <Button asChild size="lg" className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                 </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 px-6">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
            <SheetClose asChild>
              <Button variant="outline" asChild>
                 <Link href="/products">Start Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;

