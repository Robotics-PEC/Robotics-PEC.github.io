import { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT;

if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_API_ENDPOINT is not configured");
}

const supabaseHostname = new URL(supabaseUrl).hostname;
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: supabaseHostname,
                pathname: "/storage/v1/object/public/**",
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;