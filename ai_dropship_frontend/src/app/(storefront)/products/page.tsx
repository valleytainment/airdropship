// src/app/(storefront)/products/page.tsx
"use client"; // Mark as client component for state, hooks, event handlers

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/store/ProductGrid";
import { ProductPublic as Product } from "@/types"; // TODO: This Product type might need to be updated for CJdropshipping product structure
import apiClient from "@/lib/apiClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const PRODUCTS_PER_PAGE = 12;

// Separate component to handle search params and data fetching
function ProductList() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetching from the new CJ-backed endpoint /api/products
        const response = await apiClient.get("/api/products", {
          params: {
            q: query || undefined, // Search query
            page: page,            // Page number
            limit: PRODUCTS_PER_PAGE, // Products per page
          },
        });
        setProducts(response.data.products || []); // Assuming response.data.products is the array
        setCurrentPage(page);
        setSearchTerm(query);
        // Note: Sorting and total product count for pagination are not handled here
        // as the provided CJ API client and backend route do not currently support them.
        // These features may need to be added to the backend and this component later.
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]); // Clear products on error
        // Handle error state in UI, e.g., show an error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [page, query]); // Removed sort from dependencies

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", searchTerm);
    params.set("page", "1"); // Reset to page 1 on new search
    window.history.pushState(null, "", `?${params.toString()}`);
    // useEffect will trigger a re-fetch due to `query` dependency change
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Products</h1>

      {/* Filters/Search Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-grow">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        {/* Sorting UI has been removed as it's not supported by the current CJ API client */}
      </div>

      {isLoading ? (
        <p>Loading products...</p> // Replace with a proper skeleton loader
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p>No products found for your search criteria.</p>
      )}

      {/* Pagination UI has been removed as total product count is not available from the current CJ API client */}
      {/* TODO: If page > 1 and no products, or if fewer products than PRODUCTS_PER_PAGE, it implies end of results for now */}
      {/* A more robust pagination would require total product count from the API */}
      {!isLoading && products.length > 0 && (
        <div className="mt-12 flex justify-center">
          {page > 1 && (
            <Button asChild variant="outline" className="mr-2">
              <a href={`?page=${page - 1}&q=${query}`}>Previous Page</a>
            </Button>
          )}
          {/* We can only know if there *might* be a next page if we fetched a full page of results */}
          {products.length === PRODUCTS_PER_PAGE && (
            <Button asChild variant="outline">
              <a href={`?page=${page + 1}&q=${query}`}>Next Page</a>
            </Button>
          )}
        </div>
      )}

    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}> 
      <ProductList />
    </Suspense>
  );
}

