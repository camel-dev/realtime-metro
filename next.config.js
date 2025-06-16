/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  assetPrefix: isProd ? '/realtime-metro/' : '',
  basePath: isProd ? '/realtime-metro' : '',
};

module.exports = nextConfig;