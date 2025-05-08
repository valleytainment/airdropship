import HeroSection from "@/components/layout/HeroSection";
import ProductCategoriesGrid from "@/components/layout/ProductCategoriesGrid";
import { ProductPublic } from "@/types"; // Assuming this type exists or will be created
import { mockProducts } from "@/data/products"; // Assuming mock data exists or will be created
import Link from "next/link";
import { formatPrice } from "@/lib/utils"; // Assuming utility exists
import ProductImage from "@/components/ProductImage"; // Assuming this component exists

// Fetch data server-side (using mock data directly for static export)
async function getProducts(): Promise<ProductPublic[]> {
  // This is a placeholder, actual product fetching logic would go here
  // For now, using mockProducts directly
  try {
    const mappedMockProducts = mockProducts.map(p => ({
      ...p,
      id: p.id,
      internal_id: parseInt(p.id, 10),
      slug: p.slug || p.id,
      category: "Mock Category",
      supplier_internal_id: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
    })) as ProductPublic[];
    return mappedMockProducts;
  } catch (error) {
    console.error("Failed to get products:", error);
    return [];
  }
}

const StoreHomePage = async () => {
  const products = await getProducts();
  const categories = [
    { id: "1", name: "Electronics", link: "/products?category=electronics", imageUrl: "/placeholder-category-electronics.jpg" },
    { id: "2", name: "Apparel", link: "/products?category=apparel", imageUrl: "/placeholder-category-apparel.jpg" },
    { id: "3", name: "Home Goods", link: "/products?category=home-goods", imageUrl: "/placeholder-category-home.jpg" },
    { id: "4", name: "Books", link: "/products?category=books", imageUrl: "/placeholder-category-books.jpg" },
  ];

  return (
    <>
      <HeroSection 
        headline="Welcome to Airdropship!" 
        tagline="Discover amazing products curated by AI." 
        ctaText="Shop All Products" 
        ctaLink="/products" 
      />
      <ProductCategoriesGrid title="Shop by Category" categories={categories} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Featured Products</h1>
        {products.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">No products available at this time.</div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
                <Link href={`/products/${product.slug}`} className="cursor-pointer">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <ProductImage
                      src={product.image?.split(",")[0] || "/placeholder-product.jpg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                      unoptimized
                    />
                  </div>
                </Link>
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
    </>
  );
};

export default StoreHomePage;

