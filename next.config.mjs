/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: true
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/front/list',
        permanent: true,
      },
    ]
  }
};

export default nextConfig;
