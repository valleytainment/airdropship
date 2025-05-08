import React from 'react';
import Link from 'next/link';

const NavigationBar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Airdropship
        </Link>
        <div>
          <Link href="/products" className="px-3 hover:text-gray-300">
            Products
          </Link>
          <Link href="/cart" className="px-3 hover:text-gray-300">
            Cart
          </Link>
          <Link href="/tracking" className="px-3 hover:text-gray-300">
            Track Order
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
