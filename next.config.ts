import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mode standalone pour Docker
  output: "standalone",
  // Note: Pour désactiver Turbopack, utilisez --webpack dans les scripts
  // ou définissez TURBOPACK=0 dans les variables d'environnement
};

export default nextConfig;
