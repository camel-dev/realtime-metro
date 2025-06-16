// next.config.js
/** @type {import('next').NextConfig} */
// const isProd = process.env.NODE_ENV === 'production'; // 이제 이 변수는 필요 없을 수 있습니다.

const nextConfig = {
  output: 'export', // 이 설정은 GitHub Pages 정적 배포를 위해 필수이므로 유지합니다.

  // 아래 두 줄은 actions/configure-pages@v5 액션이 자동으로 처리하므로
  // 제거하거나 주석 처리하는 것이 좋습니다.
  // assetPrefix: isProd ? '/realtime-metro/' : '',
  // basePath: isProd ? '/realtime-metro' : '',

module.exports = nextConfig;