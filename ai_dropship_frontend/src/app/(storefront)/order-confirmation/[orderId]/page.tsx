// src/app/(storefront)/order-confirmation/[orderId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Order } from "@/types";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/orders/storefront/${orderId}`);
        setOrder(response.data);
      } catch (err: any) {
        console.error("Failed to fetch order details:", err);
        setError(err.response?.data?.detail || "Failed to load order details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading order details...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-destructive">Error: {error}</div>;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-8 text-center">Order not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="items-center text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <CardDescription>
            Thank you for your purchase, {order.customer_name || order.customer_email}!
            <br />
            Order ID: #{order.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.quantity} x</span>
                    <span className="line-clamp-1 text-muted-foreground">{item.product.title}</span>
                  </div>
                  <span>{formatPrice(item.price_per_unit * item.quantity)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Shipping Information</h3>
            <p className="text-sm text-muted-foreground">
              {order.customer_name && <>{order.customer_name}<br /></>}
              {order.customer_email}<br />
              {order.shipping_address}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <p className="text-sm text-muted-foreground">
              Order Status: <span className="capitalize">{order.status}</span><br />
              Payment Status: <span className="capitalize">{order.payment_status}</span><br />
              Fulfillment Status: <span className="capitalize">{order.fulfillment_status}</span>
              {order.tracking_number && <><br />Tracking: {order.tracking_number}</>}
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild variant="outline">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

