// This is now a Server Component - NO "use client" here!
import { notFound } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { ProductPublic } from "@/types";
import ProductDetailClient from "@/components/store/ProductDetailClient"; // Import the new client component

// Fetch all product IDs for static generation
export async function generateStaticParams() {
  try {
    // Fetch a list of products (adjust API endpoint/params as needed)
    // We only need the IDs for static paths
    const response = await apiClient.get<any>("/products/storefront?limit=1000"); // Fetch IDs
    const products = response.data?.products || [];

    // Return an array of objects with the `slug` parameter
    return products.map((product: { id: number }) => ({
      slug: product.id.toString(),
    }));
  } catch (error) {
    console.error("Failed to generate static params for products:", error);
    // Return an empty array or default paths in case of error
    // Returning empty means pages will be generated on demand if fallback is enabled,
    // or result in 404s if fallback is false.
    return [];
  }
}

// Fetch data for a specific product
async function getProductData(slug: string): Promise<ProductPublic | null> {
  try {
    const response = await apiClient.get(`/products/storefront/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    // Handle specific errors, e.g., 404 Not Found
    if ((error as any).response?.status === 404) {
      return null; // Let the page handle the not found case
    }
    // Re-throw other errors or return null based on desired behavior
    throw error;
  }
}

// The Page component itself (Server Component)
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductData(params.slug);

  if (!product) {
    notFound(); // Trigger 404 page if product not found
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Pass product data to the Client Component */}
      <ProductDetailClient product={product} />
    </div>
  );
}
