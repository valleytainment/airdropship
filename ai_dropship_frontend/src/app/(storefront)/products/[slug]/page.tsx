// This is now a Server Component - NO "use client" here!
import { notFound } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { ProductPublic } from "@/types";
import ProductDetailClient from "@/components/store/ProductDetailClient"; // Import the client component

// Fetch all product IDs for static generation
export async function generateStaticParams() {
  // Mock data for build process - Replace with API call when backend is live
  console.log("Using mock slugs for generateStaticParams during build.");
  return [
    { slug: '1' },
    { slug: '2' },
    { slug: '3' },
    // Add more mock slugs if needed, or keep it minimal for faster builds
  ];
  /* Original API call - uncomment when backend is accessible during build or switch to ISR/SSR
  try {
    // Fetch a list of products (adjust API endpoint/params as needed)
    // We only need the IDs for static paths
    const response = await apiClient.get<any>("/products/storefront?limit=10"); // Fetch limited IDs for build
    const products = response.data?.products || [];

    // Return an array of objects with the `slug` parameter
    return products.map((product: { internal_id: number }) => ({
      slug: product.internal_id.toString(), // Use internal_id from backend
    }));
  } catch (error) {
    console.error("Failed to generate static params for products during build:", error);
    // Return a minimal set of slugs or empty array to allow build to proceed
    return [{ slug: '1' }]; // Example fallback
  }
  */
}

// Fetch data for a specific product (Server-side)
async function getProductData(slug: string): Promise<ProductPublic | null> {
  // During build, generateStaticParams provides the slugs. We might not need
  // to fetch full data here if the page uses client-side fetching, or we can
  // return mock data if needed for static rendering.
  // For now, we assume the client component handles fetching or displays loading.
  // If full static rendering is needed, fetch from the *actual* backend URL.

  // Check if running in build environment (optional, might need env var)
  const isBuild = process.env.NODE_ENV === 'production'; // Basic check

  if (isBuild && !process.env.NEXT_PUBLIC_API_BASE_URL) {
      console.warn(`Build environment detected and no API URL set. Cannot fetch product data for slug: ${slug}. Returning null.`);
      // Return mock data or null to avoid build failure
      // Returning null will trigger notFound() if not handled
      // Let's return a basic mock structure to avoid notFound() during build for mock slugs
      if (['1', '2', '3'].includes(slug)) { // Check against our mock slugs
          return {
              internal_id: parseInt(slug, 10),
              title: `Mock Product ${slug}`,
              description: 'This is mock data used during the build process.',
              ai_description: 'AI description not available during build.',
              images: '/placeholder-image.jpg',
              current_retail_price: 99.99,
              variants: '[]', // Empty variants array
              // Add other required fields with default/mock values
              supplier_id: 1,
              supplier_product_id: `mock-${slug}`,
              stock_level: 10,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
          };
      }
      return null; // Slug not in mock list
  }

  // If not in build or API URL is set, attempt to fetch real data
  try {
    const response = await apiClient.get(`/products/storefront/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    // Handle specific errors, e.g., 404 Not Found
    if ((error as any).response?.status === 404) {
      return null; // Let the page handle the not found case
    }
    // For other errors during runtime (not build), maybe return null or rethrow
    return null; // Return null to trigger notFound() for now
  }
}

// The Page component itself (Server Component)
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductData(params.slug);

  if (!product) {
    notFound(); // Trigger 404 page if product not found or fetch failed
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Pass product data to the Client Component */}
      <ProductDetailClient product={product} />
    </div>
  );
}

