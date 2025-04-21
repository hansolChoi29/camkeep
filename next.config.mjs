// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["gocamping.or.kr"], // <- 요 부분이 반드시 있어야 합니다
  },
};

export default nextConfig;
