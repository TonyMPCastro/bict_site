import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Redireciona /uploads/:arquivo para a rota de API que serve em runtime
        // Necessário porque Next.js só serve a pasta public/ do momento do build.
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
