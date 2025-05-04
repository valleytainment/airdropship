// components/ProductList.tsx
"use client"; // May not be needed if just rendering props, but safe if using hooks later

import ProductCard from "@/components/ProductCard"; // Ensure path is correct
import { ProductPublic } from "@/types"; // Assuming types are defined here

interface ProductListProps {
  products: ProductPublic[];
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500">No products to display.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        // Map ProductPublic to the props expected by ProductCard
        <ProductCard 
          key={product.internal_id} 
          product={{
            id: product.internal_id.toString(), // Pass id as string
            name: product.name,
            price: product.price,
            image: product.image || "/placeholder-product.jpg", // Fallback image
            // description: product.description, // Pass description if needed by ProductCard
          }} 
        />
      ))}
    </div>
  );
}

