import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.179'],
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mosaskywvcvhnlqgydnj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/menu%20images/**',
      },
      {
        protocol: 'https',
        hostname: 'mosaskywvcvhnlqgydnj.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/TNG-QR/**',
      },
    ],
  },
};

export default nextConfig;
