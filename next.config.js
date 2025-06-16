/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // GitHub Pages 리포지토리 이름과 정확히 일치해야 합니다.
  basePath: '/realtime-metro', // GitHub 리포지토리 이름
  assetPrefix: '/realtime-metro/', // basePath와 동일하게 설정하고 슬래시(/)로 끝나야 합니다.
  images: {
    unoptimized: true, // 정적 빌드 시 이미지 최적화 비활성화 (필요하다면)
  },
};

module.exports = nextConfig;