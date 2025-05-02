// src/components/store/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice } from "@/lib/utils"; // Assuming a utility function for price formatting

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="h-full overflow-hidden rounded-lg">
      <Link href={`/products/${product.id}`} aria-label={product.title}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                className="object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </AspectRatio>
        </CardHeader>
      </Link>
      <Link href={`/products/${product.id}`} tabIndex={-1}>
        <CardContent className="grid gap-2.5 p-4">
          <CardTitle className="line-clamp-1 text-base font-semibold">{product.title}</CardTitle>
          {/* Optional: Add short description or category */}
          {/* <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p> */}
        </CardContent>
      </Link>
      <CardFooter className="p-4">
        <div className="flex w-full items-center justify-between space-x-2">
          <span className="font-semibold">
            {formatPrice(product.price)}
          </span>
          <Button variant="outline" size="sm" asChild>
             <Link href={`/products/${product.id}`}>View Details</Link>
             {/* Or Add to Cart Button */}
             {/* <button onClick={handleAddToCart}>Add to Cart</button> */}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

