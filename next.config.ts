import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the Turbopack root to this project. Otherwise auto-detection walks up
  // and finds C:\Users\ernie\package-lock.json, mis-roots the build, and
  // every /api/* route 404s (next-auth then crashes on the HTML response).
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
