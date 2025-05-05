// Remove "use client" - This is now a Server Component

import ProductList from "@/components/ProductList";
import { ProductPublic } from "@/types";
import { mockProducts } from "@/data/products"; // Import mock products

// Fetch data server-side (or use mock data directly for static export)
async function getProducts(): Promise<ProductPublic[]> {
  // For static export, we'll use mock data directly to avoid build-time API calls
  console.log("Using mock products for static homepage generation.");
  // Map mock data to the ProductPublic type
  const mappedMockProducts = mockProducts.map(p => ({
    ...p,
    id: p.id, // Ensure id is string if ProductPublic expects string
    internal_id: parseInt(p.id, 10),
    slug: p.slug || p.id, // Add slug if missing
    category: "Mock Category",
    supplier_internal_id: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Ensure all required fields from ProductPublic are present
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
  })) as ProductPublic[];
  return mappedMockProducts;

  /* Original API call logic - keep commented for reference
  try {
    const response = await apiClient.get("/products/storefront", {
      params: { limit: 20 },
      // Consider adding a timeout or specific fetch options for server components
    });
    return response.data.products || [];
  } catch (err) {
    console.error("Failed to fetch products server-side, returning empty array:", err);
    return []; // Return empty array on error
  }
  */
}

export default async function StoreHomePage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Featured Products</h1>
      
      {/* Pass the fetched/mock products directly to ProductList */}
      {/* ProductList itself can handle the "No products" case */}
      <ProductList products={products} />
      
    </div>
  );
}

