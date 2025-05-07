// src/app/(storefront)/products/page.tsx
"use client"; // Mark as client component for state, hooks, event handlers

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/store/ProductGrid";
import { ProductPublic as Product } from "@/types";
import apiClient from "@/lib/apiClient";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const PRODUCTS_PER_PAGE = 12;

// Separate component to handle search params and data fetching
function ProductList() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at"); // Default sort

  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "created_at";

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const offset = (page - 1) * PRODUCTS_PER_PAGE;
        const response = await apiClient.get("/products/storefront", {
          params: {
            skip: offset,
            limit: PRODUCTS_PER_PAGE,
            search: query || undefined,
            sort_by: sort || undefined,
            // category: category || undefined, // Add category filter if needed
          },
        });
        setProducts(response.data.products);
        setTotalProducts(response.data.total);
        setCurrentPage(page);
        setSortBy(sort);
        setSearchTerm(query);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Handle error state in UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [page, query, sort]);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set("q", searchTerm);
    params.set("page", "1"); // Reset to page 1 on new search
    window.history.pushState(null, "", `?${params.toString()}`);
    // Trigger re-fetch by updating state that useEffect depends on, or rely on useEffect dependency
    // For simplicity, relying on useEffect dependency on `query`
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.set("page", "1"); // Reset to page 1 on sort change
    window.history.pushState(null, "", `?${params.toString()}`);
    // Trigger re-fetch
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Products</h1>

      {/* Filters/Search/Sort Row */}
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              {/* Add other sort options if needed */}
            </SelectContent>
          </Select>
        </div>
        {/* Add Category Filters here if needed */}
      </div>

      {isLoading ? (
        <p>Loading products...</p> // Replace with a proper skeleton loader
      ) : (
        <ProductGrid products={products} />
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={currentPage > 1 ? `?page=${currentPage - 1}&q=${query}&sort=${sort}` : "#"} aria-disabled={currentPage <= 1} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Basic pagination display logic (show first, last, current, and neighbors)
              const showPage = pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1;
              const showEllipsis = Math.abs(pageNum - currentPage) === 2;

              if (showPage) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink href={`?page=${pageNum}&q=${query}&sort=${sort}`} isActive={currentPage === pageNum}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (showEllipsis) {
                return <PaginationEllipsis key={`ellipsis-${pageNum}`} />;
              }
              return null;
            })}
            <PaginationItem>
              <PaginationNext href={currentPage < totalPages ? `?page=${currentPage + 1}&q=${query}&sort=${sort}` : "#"} aria-disabled={currentPage >= totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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

