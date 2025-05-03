"use client"

import { useState } from "react"
import Image from "next/image"
import { Product } from "@/types"
import AddToCartButton from "@/components/store/AddToCartButton"
import { Input } from "@/components/ui/input"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function ClientProductPage({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1) {
      setQuantity(value)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div>
        <AspectRatio ratio={1} className="overflow-hidden rounded-lg border bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">No Image Available</span>
            </div>
          )}
        </AspectRatio>
      </div>

      {/* Product Info & Actions */}
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{product.title}</h1>
        <div className="text-2xl font-semibold">${(product.price / 100).toFixed(2)}</div>

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-4">
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            className="w-20"
            aria-label="Quantity"
          />
          <AddToCartButton product={product} quantity={quantity} size="lg" />
        </div>

        {/* Description / Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-4">
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {product.description || "No description available."}
            </div>
          </TabsContent>
          <TabsContent value="details" className="pt-4">
            <p className="text-sm text-muted-foreground">
              Category: {product.category || "N/A"}<br />
              Tags: {product.tags?.join(", ") || "N/A"}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
)
}
