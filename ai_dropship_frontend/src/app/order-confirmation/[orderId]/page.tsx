// Ensure NO "use client" directive here. This is a Server Component.
import OrderConfirmationClient from "@/components/store/OrderConfirmationClient";

// Define and export generateStaticParams
// Required for static export with dynamic routes.
// Return a placeholder object because output:export might require at least one path.
export async function generateStaticParams() {
  console.log("generateStaticParams for order confirmation: Returning placeholder path.");
  // Use orderId to match the directory name
  return [{ orderId: 'build-placeholder' }]; 
}

// Define the Page component (Server Component)
// It receives params from Next.js
interface OrderConfirmationPageProps {
  params: {
    orderId: string; // Use orderId to match the directory name
  };
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  // Use orderId to match the directory name
  const { orderId } = params;

  // Render the Client Component, passing the orderId
  // The Client Component will handle data fetching and display
  return <OrderConfirmationClient orderId={orderId} />;
}

