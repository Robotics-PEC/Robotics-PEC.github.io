import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    output: "export", // Enables static export
    images: {
        unoptimized: true, // Disables Next.js image optimization for static exports
    },
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
