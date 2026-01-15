/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['easycontracts.tech'],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  // Configurazione per production
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

export default nextConfig;

