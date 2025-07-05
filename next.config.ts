import nextPwa from 'next-pwa';
import type { NextConfig } from 'next';

const withPWA = nextPwa({
    dest: 'public',
    register: true,
    skipWaiting: true,
    // disable: process.env.NODE_ENV === 'development',   // handy during dev
});

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        unoptimized: false
    },
};

export default withPWA(nextConfig);
