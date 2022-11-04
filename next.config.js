/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    environment: process.env.ENVIRONMENT,
    endpoint: {
      web: process.env.WEB_URL,
      api: process.env.API_URL,
    },
    timeout: process.env.TIMEOUT,
  }
}

module.exports = nextConfig
