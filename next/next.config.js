/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {appDir: true},
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["http://localhost/", "http://127.0.0.1/", "http://192.168.254.103/", process.env.NEXT_PUBLIC_API_SERVER_URL]
  },
  poweredByHeader: false, //remove "x-powered-by: NextJS" header (better cybersecurity)
};

module.exports = nextConfig;

