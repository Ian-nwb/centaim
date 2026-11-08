import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root so a package-lock.json further up the filesystem
  // is not mistaken for this project's.
  turbopack: { root: import.meta.dirname },
  // The pre-revamp site served the landing page at /landing and a second
  // marketing page at /home. Both are now the one scroll story at /, so
  // keep the old links alive instead of 404ing them.
  redirects() {
    return [
      { source: "/landing", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
