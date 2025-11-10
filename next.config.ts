import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: [
      "raw.githubusercontent.com",
      "raw.githubusercontent.com",
      "pokeapi.co",
      "assets.pokemon.com",
    ],
  },
};

export default nextConfig;
