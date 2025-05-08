// components/ProductList.tsx
"use client"; // May not be needed if just rendering props, but safe if using hooks later

import ProductCard from "@/components/ProductCard"; // Ensure path is correct
import { ProductPublic } from "@/types"; // Use the updated ProductPublic type

interface ProductListProps {
  products: ProductPublic[];
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-10">No products to display.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        // Pass the entire product object directly to ProductCard
        // Ensure ProductCard expects the ProductPublic type
        <ProductCard 
          key={product.id} // Use the string id from ProductPublic
          product={product} 
        />
      ))}
    </div>
  );
}

