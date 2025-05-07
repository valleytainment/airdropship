const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for identifying potential problems
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**", 
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (config.optimization.minimizer && config.optimization.minimizer[0] && config.optimization.minimizer[0].options) {
        config.optimization.minimizer[0].options.keep_classnames = true;
        config.optimization.minimizer[0].options.keep_fnames = true;
    }
    return config;
  },
  experimental: {
    // modularizeImports: { // This caused issues in some Next.js versions, ensure compatibility or remove if problematic
    //   "@mui/material": {
    //     transform: "@mui/material/{{member}}",
    //   },
    // },
  },
  productionBrowserSourceMaps: true,
  compress: false,
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: *; font-src 'self'; connect-src 'self' *; frame-src 'self';",
          },
          // You can add other standard security headers here if needed
          // {
          //   key: "X-Content-Type-Options",
          //   value: "nosniff",
          // },
          // {
          //   key: "X-Frame-Options",
          //   value: "SAMEORIGIN",
          // },
          // {
          //   key: "X-XSS-Protection",
          //   value: "1; mode=block",
          // },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);

