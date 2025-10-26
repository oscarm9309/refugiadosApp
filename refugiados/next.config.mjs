/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- AÑADÍ ESTE BLOQUE DE CÓDIGO ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // ------------------------------------
};

export default nextConfig;