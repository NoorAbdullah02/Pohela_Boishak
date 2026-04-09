const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      },
    ],
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;
