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

  // Removed experimental.turbo as it was causing config validation error
  // experimental: {
  //   turbo: false // Disable until stable
  // },
};

module.exports = nextConfig;
