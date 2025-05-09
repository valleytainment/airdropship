import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User } from 'lucide-react'; // Assuming lucide-react for icons

const NavigationBar = () => {
  return (
    <nav className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary font-poppins">
          Airdropship
        </Link>

        {/* Navigation Links - Centered for larger screens */}
        <div className="hidden md:flex items-center space-x-6 font-poppins text-sm font-medium">
          <Link href="/products" className="text-foreground hover:text-primary transition-colors">
            All Products
          </Link>
          <Link href="/categories/electronics" className="text-foreground hover:text-primary transition-colors">
            Electronics
          </Link>
          <Link href="/categories/apparel" className="text-foreground hover:text-primary transition-colors">
            Apparel
          </Link>
          <Link href="/deals" className="text-accent hover:text-primary transition-colors">
            Deals
          </Link>
        </div>

        {/* Icons - Right Aligned */}
        <div className="flex items-center space-x-4">
          <button aria-label="Search" className="text-foreground hover:text-primary transition-colors">
            <Search size={22} />
          </button>
          <Link href="/cart" aria-label="Cart" className="text-foreground hover:text-primary transition-colors relative">
            <ShoppingCart size={22} />
            {/* Optional: Cart item count badge */}
            {/* <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span> */}
          </Link>
          <Link href="/account" aria-label="Account" className="text-foreground hover:text-primary transition-colors">
            <User size={22} />
          </Link>
        </div>

        {/* Mobile Menu Button - Add later if needed */}
        {/* <div className="md:hidden"> ... </div> */}
      </div>
    </nav>
  );
};

export default NavigationBar;

