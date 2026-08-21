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
    typescript: {
        ignoreBuildErrors: true,
    },
    async rewrites() {
        return [
            {
                source: "/Docify",
                destination: "https://robotics-pec.github.io/Docify/",
            },
            {
                source: "/Docify/:path*",
                destination: "https://robotics-pec.github.io/Docify/:path*",
            },

            {
                source: "/Cha-Ching",
                destination: "https://robotics-pec.github.io/Cha-Ching/",
            },
            {
                source: "/Cha-Ching/:path*",
                destination: "https://robotics-pec.github.io/Cha-Ching/:path*",
            },
        ];
    },
};

export default nextConfig;