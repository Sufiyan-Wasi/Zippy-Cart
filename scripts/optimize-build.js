#!/usr/bin/env node

// Script to optimize Next.js build performance
const fs = require('fs');
const path = require('path');

console.log('Optimizing Next.js build performance...');

// Clean build caches
const cleanDirs = ['.next', '.turbo'];
cleanDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✓ Cleaned ${dir} directory`);
  }
});

// Create optimized next.config.js if it doesn't exist
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
const nextConfigMjsPath = path.join(process.cwd(), 'next.config.mjs');

if (!fs.existsSync(nextConfigPath) && !fs.existsSync(nextConfigMjsPath)) {
  const optimizedConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-tabs',
      'lucide-react',
      'recharts'
    ]
  }
}

module.exports = nextConfig`;

  fs.writeFileSync(nextConfigPath, optimizedConfig);
  console.log('✓ Created optimized next.config.js');
}

console.log('✓ Build optimization complete!');
console.log('Run "npm run dev" to start the development server with improved performance.');