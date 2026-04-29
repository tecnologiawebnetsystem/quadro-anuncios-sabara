// @ts-nocheck
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: '.next',
  devIndicators: false,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
