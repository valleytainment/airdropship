// ai_dropship_frontend/next.config.js

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Required for static export
  output: "export",

  // Essential for image optimization in static export
  images: {
    unoptimized: true,
  },

  // Removed headers configuration as per error log analysis
  // headers: async () => [ ... ],

  // Optional build-time overrides (use cautiously)
  eslint: {
    ignoreDuringBuilds: process.env.CI === "true",
  },
  typescript: {
    ignoreBuildErrors: process.env.CI === "true",
  },

  // Add experimental turbo cache config as per error log analysis
  experimental: {
    turbo: {
      cache: true,
    },
  },
};

module.exports = nextConfig;

