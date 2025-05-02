// src/app/(storefront)/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import ProductGrid from "@/components/store/ProductGrid";
// import { Product } from "@/types";
// import apiClient from "@/lib/apiClient";

// async function getFeaturedProducts(): Promise<Product[]> {
//   try {
//     // Adjust API endpoint as needed
//     const response = await apiClient.get("/products/storefront?limit=8&sort_by=trending"); // Assuming a trending sort option
//     return response.data.products;
//   } catch (error) {
//     console.error("Failed to fetch featured products:", error);
//     return []; // Return empty array on error
//   }
// }

export default async function HomePage() {
  // const featuredProducts = await getFeaturedProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-muted rounded-lg mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
          Discover Products Found by AI
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Trending items, unique finds, all curated automatically.
        </p>
        <Button asChild size="lg">
          <Link href="/products">Shop Now</Link>
        </Button>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Featured Products</h2>
        {/* <ProductGrid products={featuredProducts} /> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Placeholder Content - Replace with ProductGrid */}
          <div className="border rounded-lg p-4 text-center bg-card text-card-foreground">
            <div className="bg-muted aspect-square w-full rounded mb-4"></div>
            <h3 className="font-semibold">Product Title</h3>
            <p>$99.99</p>
            <Button variant="outline" size="sm" className="mt-2">View Details</Button>
          </div>
          <div className="border rounded-lg p-4 text-center bg-card text-card-foreground">
            <div className="bg-muted aspect-square w-full rounded mb-4"></div>
            <h3 className="font-semibold">Product Title</h3>
            <p>$99.99</p>
            <Button variant="outline" size="sm" className="mt-2">View Details</Button>
          </div>
          <div className="border rounded-lg p-4 text-center bg-card text-card-foreground">
            <div className="bg-muted aspect-square w-full rounded mb-4"></div>
            <h3 className="font-semibold">Product Title</h3>
            <p>$99.99</p>
            <Button variant="outline" size="sm" className="mt-2">View Details</Button>
          </div>
          <div className="border rounded-lg p-4 text-center bg-card text-card-foreground">
            <div className="bg-muted aspect-square w-full rounded mb-4"></div>
            <h3 className="font-semibold">Product Title</h3>
            <p>$99.99</p>
            <Button variant="outline" size="sm" className="mt-2">View Details</Button>
          </div>
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

