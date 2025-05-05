"use client"; // Required for useState, useEffect

import { useState, useEffect } from "react"; // Import useEffect
import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cart";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCartStore();
  
  // State to track client-side mounting
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Get item count only after mounting to avoid hydration mismatch
  const itemCount = hasMounted ? totalItems() : 0;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side: Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">AI Dropship Store</span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:items-center">
            <Link href="/products" className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
              Products
            </Link>
          </div>

          {/* Right side: Icons and Mobile Menu Button */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Cart Icon */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ShoppingCart className="h-6 w-6" />
                  {/* Render badge only after mounting and if items exist */}
                  {hasMounted && itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
              {/* Account Icon */}
              <Link href="/account">
                <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <User className="h-6 w-6" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="ml-2 flex items-center sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-40 border-t dark:border-gray-700" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/products" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMobileMenu}>
              Products
            </Link>
            <Link href="/cart" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMobileMenu}>
              {/* Display cart count in mobile menu only after mount */}
              Shopping Cart {hasMounted && itemCount > 0 ? `(${itemCount})` : ""}
            </Link>
            <Link href="/account" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMobileMenu}>
              Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

