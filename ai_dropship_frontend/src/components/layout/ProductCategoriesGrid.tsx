import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Added import for Next.js Image component

interface Category {
  id: string;
  name: string;
  link: string;
  imageUrl: string;
}

interface ProductCategoriesGridProps {
  title: string;
  categories: Category[];
}

const ProductCategoriesGrid: React.FC<ProductCategoriesGridProps> = ({ title, categories }) => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">{title}</h2>
        {categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories to display.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link key={category.id} href={category.link} className="group block">
                <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <Image 
                    src={category.imageUrl || '/placeholder-category.jpg'} 
                    alt={category.name} 
                    width={300} // Added width for Next.js Image
                    height={300} // Added height for Next.js Image
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                  <div className="p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategoriesGrid;
