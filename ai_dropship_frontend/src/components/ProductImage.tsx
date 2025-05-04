import Image from 'next/image';

// Basic placeholder image data URL (replace with a real one if desired)
const placeholderBlurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  // Provide a default image source if the provided src is null or undefined
  const imageSrc = src || '/placeholder-image.png'; // Consider adding a real placeholder image to /public

  return (
    <div className="aspect-square overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800 group-hover:opacity-75">
      <Image
        src={imageSrc}
        alt={alt}
        width={600} // Adjust width as needed for your layout
        height={600} // Adjust height to match width for aspect-square
        quality={85} // Default is 75, 85 is a good balance
        placeholder="blur"
        blurDataURL={placeholderBlurDataURL}
        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        // Handle potential errors loading the image
        onError={(e) => {
          // Optional: Log error or set a fallback state
          console.error(`Failed to load image: ${imageSrc}`, e);
          // You could potentially change the src to a fallback image here if needed
          // e.currentTarget.src = '/image-error.png'; 
        }}
      />
    </div>
  );
}

