/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Use Webpack instead of Turbopack due to symlink issues on Windows
  webpack: (config) => {
    config.externals.push({
      'mongodb': 'commonjs mongodb'
    });
    return config;
  },
  // Explicitly disable Turbopack and use Webpack
  serverExternalPackages: ['mongodb'],
  // Add empty turbopack config to silence the error
  turbopack: {}
}

export default nextConfig
