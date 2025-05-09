// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartSheet } from "./CartSheet"; // Import CartSheet
import { useCartStore } from "@/lib/stores/cart"; // Import cart store

const Header = () => {
  const totalItems = useCartStore((state) => state.totalItems); // Get cart item count

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* <Icons.logo className="h-6 w-6" /> Replace with your logo */}
            <span className="hidden font-bold sm:inline-block">
              AI Dropship Store
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/products"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Products
            </Link>
            {/* Add other nav links as needed */}
            {/* <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link> */}
          </nav>
        </div>
        {/* Add Mobile Nav Toggle here if needed */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {/* Cart Button/Sheet Trigger */}
            <CartSheet
              trigger={
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {/* Optional: Add item count badge */}
                  {totalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      {totalItems()}
                    </span>
                  )}
                  <span className="sr-only">Shopping Cart</span>
                </Button>
              }
            >
              <>{/* Placeholder for cart content */}</>
            </CartSheet>

            {/* User Account Button */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account"> {/* Link to account page or login */}
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

