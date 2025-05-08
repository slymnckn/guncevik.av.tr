/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['pjjmouhsruudeniqcpuv.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pjjmouhsruudeniqcpuv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    unoptimized: true,
  },
  // Font optimizasyonu için doğru yapılandırma
  experimental: {
    // optimizeFonts kaldırıldı
  },
};

export default nextConfig;
