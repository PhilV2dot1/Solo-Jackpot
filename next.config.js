/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Redirect Farcaster manifest to hosted version
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/019aa99b-e5ea-79c1-95d1-18c77aa9ef12',
        permanent: false, // 307 Temporary Redirect
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        pathname: '/coins/images/**',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // Add React Native fallback to suppress MetaMask SDK warnings
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
};

module.exports = nextConfig;
