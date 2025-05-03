// ai_dropship_frontend/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for static export
  output: 'export',
  
  // Essential for image optimization in static export
  images: {
    unoptimized: true,
  },

  // Recommended security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        }
      ],
    },
  ],

  // Optional build-time overrides (use cautiously)
  eslint: { 
    ignoreDuringBuilds: process.env.CI === 'true' 
  },
  typescript: { 
    ignoreBuildErrors: process.env.CI === 'true' 
  }
};

module.exports = nextConfig;