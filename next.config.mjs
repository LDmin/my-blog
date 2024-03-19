/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/front',
        permanent: true,
      },
    ]
  }
};

export default nextConfig;
