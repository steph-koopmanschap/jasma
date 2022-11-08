/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {appDir: true},
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"]
  },
  poweredByHeader: false, //remove x-powered-by: NextJS header (better cybersecurity)
};

module.exports = nextConfig;

