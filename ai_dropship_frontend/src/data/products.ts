// Define the type for mock products
interface MockProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  slug: string; // Added slug property
}

// Export the mock product data as specified in the checklist
export const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Airdrop Starter Kit",
    price: 99.99,
    image: "/placeholder-product.jpg", // Using placeholder as per checklist
    description: "Essential tools for successful airdrop campaigns",
    slug: "1", // Added slug, using id for simplicity
  },
  {
    id: "2",
    name: "Token Distribution Suite",
    price: 149.99,
    image: "/placeholder-product.jpg", // Using placeholder as per checklist
    description: "Complete package for token distribution",
    slug: "2", // Added slug, using id for simplicity
  },
  // Add more mock products if needed
];

