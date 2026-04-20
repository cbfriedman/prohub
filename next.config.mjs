/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(process.env.REPL_ID
    ? {
        allowedDevOrigins: [
          process.env.REPLIT_DEV_DOMAIN,
          "*.replit.dev",
          "*.spock.replit.dev",
          "*.worf.replit.dev",
          "*.kirk.replit.dev",
        ].filter(Boolean),
      }
    : {}),
}

export default nextConfig
