// ai_dropship_frontend/next.config.js

const webpack = require('webpack');

// In Node/SSR, ensure global.matchMedia exists:
if (typeof global.matchMedia !== 'function') {
  global.matchMedia = () => ({
    matches: false,
    media: '',
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export
  output: 'export',

  // Ignore lint/type errors in CI
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Patch the webpack build so any window.matchMedia calls use our stub:
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        // This injects at compile time a no-op function:
        'window.matchMedia': 'function(query) { return { matches: false, media: query, addListener: ()=>{}, removeListener: ()=>{}, addEventListener: ()=>{}, removeEventListener: ()=>{}, onchange: null, dispatchEvent: ()=>false }; }'
      })
    );
    return config;
  },
};

module.exports = nextConfig;
