// This is now a Server Component - NO "use client" here!
import OrderConfirmationClient from "@/components/store/OrderConfirmationClient";

// Required for static export with dynamic routes, even if we don't pre-render specific orders
export async function generateStaticParams() {
  // We don't need to pre-render any specific order confirmation pages
  // Return an empty array to satisfy the build requirement
  return [];
}

// The Page component itself (Server Component)
export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  // We get the orderId from params (server-side)
  const orderId = params.orderId;

  // Render the Client Component, passing the orderId as a prop
  return <OrderConfirmationClient orderId={orderId} />;
}

