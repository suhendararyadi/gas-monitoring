import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development", // Nonaktifkan PWA di mode development
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/gas-monitoring\.vercel\.app\/api\/.*$/, // URL API dengan pola ini akan dicache
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // Cache selama 1 hari
          },
        },
      },
    ],
  },
});