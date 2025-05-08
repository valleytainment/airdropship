import React from 'react';

interface HeroSectionProps {
  headline: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ headline, tagline, ctaText, ctaLink }) => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {headline}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {tagline}
        </p>
        <a href={ctaLink} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg">
          {ctaText}
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
