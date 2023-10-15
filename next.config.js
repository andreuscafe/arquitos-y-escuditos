/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = {
      canvas: "canvas"
    };
    return config;
  }
};

module.exports = nextConfig;
