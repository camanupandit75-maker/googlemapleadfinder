/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "geonayan.com" }],
        destination: "https://www.geonayan.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
