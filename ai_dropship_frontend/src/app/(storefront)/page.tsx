"use client";

import { useEffect, useState } from "react";
import ProductList from "@/components/ProductList"; // Import the new ProductList component
import apiClient from "@/lib/apiClient";
import { ProductPublic } from "@/types"; // Assuming types are defined here
import { mockProducts } from "@/data/products"; // Import mock products

export default function StoreHomePage() {
  const [products, setProducts] = useState<ProductPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/products/storefront", {
          params: { limit: 20 },
          timeout: 5000,
        });
        setProducts(response.data.products || []);
        setError(null);
      } catch (err) {
        console.warn("Failed to fetch products from API, using mock data:", err);
        setError("Failed to load live products. Displaying mock data.");
        const mappedMockProducts = mockProducts.map(p => ({ 
          ...p, 
          internal_id: parseInt(p.id, 10),
          category: "Mock Category",
          supplier_internal_id: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })) as ProductPublic[];
        setProducts(mappedMockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Featured Products</h1>
      
      {loading && <div className="text-center">Loading products...</div>}
      {error && <div className="text-center text-orange-500 mb-4">{error}</div>}

      {/* Use the ProductList component to display products */}
      {!loading && <ProductList products={products} />}
      
      {/* The explicit "No products found" message is now handled within ProductList */}
      {/* {!loading && products.length === 0 && ( <div className="text-center text-gray-500">No products found.</div> )} */}
    </div>
  );
}

