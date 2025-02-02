/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["geist", "swagger-ui-react"],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
};

export default config;
