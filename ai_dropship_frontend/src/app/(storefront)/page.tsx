"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/store/ProductCard";
import apiClient from "@/lib/apiClient";
import { ProductPublic } from "@/types"; // Assuming types are defined here

export default function StoreHomePage() {
  const [products, setProducts] = useState<ProductPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products from the backend API
        const response = await apiClient.get("/products/storefront", {
          params: {
            limit: 20, // Adjust limit as needed
            // Add other params like category, search, sort_by if implementing filters
          },
        });
        // Assuming the backend returns data in the shape { products: [], total: number, ... }
        setProducts(response.data.products || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
        setProducts([]); // Clear products on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Featured Products</h1>
      {/* Optional: Add category filters/search/sort controls here */}

      {loading && <div className="text-center">Loading products...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-gray-500">No products found.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.internal_id} product={product} /> // Use internal_id from backend
          ))}
        </div>
      )}
    </div>
  );
}

