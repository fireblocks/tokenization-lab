// @ts-check
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: false,
});

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  /** We run eslint as a separate task in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  webpack(config, context) {
    config.module.rules.push({
      test: /\.sol$/,
      use: "raw-loader",
    });

    return config;
  },
};

// @ts-ignore
module.exports = withPWA(nextConfig);
