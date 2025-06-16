/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  basePath: isProduction ? 'https://camel-dev.github.io/realtime-metro/' : '',
  // next 이미지 최적화 옵션 off
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;