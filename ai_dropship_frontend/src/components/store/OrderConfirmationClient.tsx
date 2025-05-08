"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { Order } from "@/types"; // Assuming types are defined

interface OrderConfirmationClientProps {
  orderId: string; // Use orderId to match the parent Server Component
}

// Helper function to fetch order data (remains client-side for this component)
async function getOrderData(orderId: string): Promise<Order | null> {
  try {
    // Use orderId in the API call
    const response = await apiClient.get(`/orders/storefront/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch order ${orderId}:`, error);
    if ((error as any).response?.status === 404) {
      throw new Error("Order not found.");
    }
    throw new Error("Failed to load order details.");
  }
}

export default function OrderConfirmationClient({ orderId }: OrderConfirmationClientProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID is missing."); // Updated error message
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getOrderData(orderId);
        setOrder(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]); // Depend on orderId

  return (
    <div className="container mx-auto px-4 py-16">
      {loading && (
        <div className="text-center">Loading order confirmation...</div>
      )}

      {error && (
        <div className="text-center text-red-500">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
          <Link href="/" legacyBehavior>
            <Button className="mt-6">Go to Homepage</Button>
          </Link>
        </div>
      )}

      {!loading && !error && order && (
        <div className="text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-gray-600 mb-2">Your order has been placed successfully.</p>
          <p className="text-gray-600 mb-8">
            Order ID: <span className="font-medium text-gray-800">{order.id}</span>
          </p>

          {/* Order Summary Section */}
          <div className="max-w-md mx-auto border rounded-lg p-6 text-left mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="mb-4">
              <p><strong>Email:</strong> {order.customer_email}</p>
              <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
            </div>
            <div className="space-y-2 mb-4">
              {/* Ensure order.items is an array before mapping */}
              {Array.isArray(order.items) && order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm border-b pb-1">
                  <div>
                    <span className="font-medium">{item.product?.title || `Product ID: ${item.product_id}`}</span>
                    <span className="text-gray-500"> (x{item.quantity})</span>
                  </div>
                  <span>${(item.price_per_unit * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total Paid</span>
              <span>${order.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-gray-500 mb-4">You will receive an email confirmation shortly.</p>
          <Link href="/" legacyBehavior>
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

