import nextPwa from 'next-pwa';
import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    // Merged from your deleted .mjs file to ensure images load
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blob.v0.dev',
      },
    ],
  },
};

const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
});

export default isDev ? nextConfig : withPWA(nextConfig);
