/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  /** We run eslint as a separate task in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },
};
