/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // GitHub Pages 리포지토리 이름과 동일하게 설정
  basePath: process.env.NODE_ENV === 'production' ? '/realtime-metro' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/realtime-metro/' : '',
};

module.exports = nextConfig;