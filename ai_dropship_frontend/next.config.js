// ai_dropship_frontend/next.config.js

// Polyfill matchMedia so SSR on Netlify never blows up when calling `.matches`
if (typeof global.matchMedia !== "function") {
  global.matchMedia = () => ({
    matches: false,
    addListener: () => {},        // legacy
    removeListener: () => {},     // legacy
    addEventListener: () => {},
    removeEventListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output a fully static export
  output: "export",

  // Skip ESLint checks during CI/build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Skip TypeScript type errors during CI/build
  typescript: {
    ignoreBuildErrors: true,
  },

  // …any other Next.js settings you already had…
};

module.exports = nextConfig;
