// Ensure NO "use client" directive here. This is a Server Component.
import OrderConfirmationClient from "@/components/store/OrderConfirmationClient";

// Define and export generateStaticParams
// Required for static export with dynamic routes.
// Return a placeholder object because output:export might require at least one path.
export async function generateStaticParams() {
  console.log("generateStaticParams for order confirmation: Returning placeholder path.");
  return [{ confirmationId: 'build-placeholder' }]; // Return placeholder instead of empty array
}

// Define the Page component (Server Component)
// It receives params from Next.js
interface OrderConfirmationPageProps {
  params: {
    confirmationId: string;
  };
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { confirmationId } = params;

  // Render the Client Component, passing the confirmationId
  // The Client Component will handle data fetching and display
  return <OrderConfirmationClient confirmationId={confirmationId} />;
}

