/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        // This allows using images from /public/images without any extra config
        unoptimized: false, // keep image optimization enabled (recommended)
    },
};

export default nextConfig;
