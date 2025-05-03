// src/app/(storefront)/order-confirmation/[orderId]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import apiClient from "@/lib/apiClient";
import type { Metadata } from "next";
import type { Order } from "@/types";

// 1️⃣ Provide the list of orderId params to pre-render
export async function generateStaticParams(): Promise<
  { orderId: string }[]
> {
  // For static export, we cannot pre-render dynamic order IDs without knowing them at build time.
  // Return a dummy param to satisfy Next.js export requirements.
  // The page component should handle cases where the dummy ID doesn't fetch real data (e.g., show notFound).
  if (process.env.CI === 'true' || process.env.NODE_ENV === 'production') {
    return [{ orderId: 'dummy-order' }]; // Provide a dummy param for static export
  }

  // In development or other environments, try fetching orders (may still fail if backend isn't running)
  try {
    const { data: orders } = await apiClient.get<Order[]>("/orders");
    // Ensure orders is an array before mapping
    if (Array.isArray(orders)) {
        return orders.map((order) => ({ orderId: order.id }));
    } else {
        console.warn("Fetched orders is not an array:", orders);
        return [{ orderId: 'dummy-order' }]; // Fallback if API response is unexpected
    }
  } catch (error) {
    console.warn("Failed to fetch orders for generateStaticParams:", error);
    return [{ orderId: 'dummy-order' }]; // Fallback to dummy param on error
  }
}

// 2️⃣ Generate per-page metadata (await params)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order ${orderId} Confirmation`,
    description: `Details for order ${orderId}`,
  };
}

// 3️⃣ Default export: async page component with Promise params
export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  let order: Order;
  try {
    const res = await apiClient.get<Order>(`/orders/${orderId}`);
    order = res.data;
  } catch {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Thank You for Your Purchase!
      </h1>
      <p className="mb-2">
        <strong>Order #:</strong> {orderId}
      </p>
      <p className="mb-6">
        A confirmation email has been sent to <strong>{order.email}</strong>.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Order Details</h2>
      <ul className="list-disc pl-5 space-y-1">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity} — $
            {((item.price * item.quantity) / 100).toFixed(2)}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Link href="/products" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
