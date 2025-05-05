'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  unoptimized?: boolean;
}

export default function ProductImage({ 
  src,
  alt,
  width,
  height,
  className,
  unoptimized = false 
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    // Set fallback image source
    setImgSrc('/placeholder-image.jpg'); 
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={unoptimized}
      onError={handleError}
      // Optional: Add placeholder if needed, ensure blurDataURL is valid if used
      // placeholder="blur"
      // blurDataURL="data:image/webp;base64,..." 
    />
  );
}

