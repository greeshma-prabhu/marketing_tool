/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.postermywall.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig

