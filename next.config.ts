import os from "node:os";
import type { NextConfig } from "next";

/**
 * Hostnames the dev server should accept requests from, worked out at startup rather
 * than written down — a home router hands out a different IP often enough that a
 * hardcoded one goes stale. Covers this machine's current addresses, its Bonjour name,
 * and the private ranges a phone or laptop on the same Wi-Fi will come from.
 */
function devOrigins(): string[] {
  const addresses = Object.values(os.networkInterfaces())
    .flat()
    .filter((n) => n && !n.internal && n.family === "IPv4")
    .map((n) => n!.address);

  const hostname = os.hostname().replace(/\.local$/i, "");

  return [
    ...new Set([
      ...addresses,
      hostname,
      `${hostname}.local`,
      // A `*` stands for exactly one label, so these cover any host on a private network.
      "192.168.*.*",
      "10.*.*.*",
      "172.*.*.*",
    ]),
  ];
}

const nextConfig: NextConfig = {
  // Development only: production never serves the dev endpoints this guards.
  ...(process.env.NODE_ENV === "development" ? { allowedDevOrigins: devOrigins() } : {}),
};

export default nextConfig;
