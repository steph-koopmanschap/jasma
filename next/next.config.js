/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {appDir: true},
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["http://localhost/", "http://127.0.0.1/"]
  },
  poweredByHeader: false, //remove x-powered-by: NextJS header (better cybersecurity)
};

module.exports = nextConfig;

