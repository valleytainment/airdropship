// This page now fetches data client-side or uses SWR/React Query for better UX
// Using useEffect and useState for client-side data fetching as an example.
// For Server Components, data fetching is done differently (as in the original mock example).
// However, to call an external backend API (localhost:8000) from a Next.js app (localhost:3000)
// during build (if SSG) or request (if SSR in app router), specific configurations or client-side fetching is needed.
// For simplicity in this step, let's assume client-side fetching or that a proxy is set up.
// Given the current setup, a direct fetch from a Server Component to localhost:8000 might be problematic without proper setup.
// Let's revert to a structure more amenable to Server Components if the API were internal or proxied,
// or use client-side fetching for clarity with external APIs in dev.

// Reverting to Server Component style, assuming the API can be reached server-side.
// If NEXT_PUBLIC_BACKEND_URL is not set, this will fail in production if backend is separate.
// For local development, this fetch will be made from the Node.js environment running Next.js.

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ProductImage"; // Keep ProductImage import for later
// import { useEffect, useState } from "react"; // Removed unused imports

interface CJProduct {
  pid: string;
  productNameEn: string;
  productSku: string;
  productImage: string;
  productWeight: string;
  categoryName: string;
  sellPrice: string;
}
interface ProductDisplay {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}

async function fetchProducts(query: string): Promise<ProductDisplay[]> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  try {
    console.log(`Fetching products from: ${backendUrl}/api/products?q=${query}`);
    const response = await fetch(`${backendUrl}/api/products?q=${query}`, { cache: 'no-store' });
    if (!response.ok) {
      console.error("Failed to fetch products: ", response.status, await response.text());
      return [];
    }
    const data = await response.json();
    if (data.error) {
      console.error("API returned an error:", data.error);
      return [];
    }
    const cjProducts: CJProduct[] = data.products || [];
    console.log("Fetched CJ Products raw:", cjProducts);
    return cjProducts.map(p => ({
      id: p.pid,
      name: p.productNameEn,
      slug: p.pid,
      description: p.productNameEn,
      price: parseFloat(p.sellPrice) || 0,
      image: p.productImage || "/placeholder-product.jpg",
      category: p.categoryName,
    }));
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    return [];
  }
}

export default async function StoreHomePage() {
  const products = await fetchProducts("featured electronics");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Featured Products</h1>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          No products available at this time. Please check back later.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
              <Link href={`/products/${product.slug}`} className="cursor-pointer">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <ProductImage 
                    src={product.image || "/placeholder-product.jpg"} 
                    alt={product.name} 
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:opacity-75"
                  />
                </div>
              </Link>
              {/* Placeholder for the rest of product details */}
              <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  <Link href={`/products/${product.slug}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </Link>
                </h3>
                <div className="flex flex-1 flex-col justify-end">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
