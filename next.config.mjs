/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  images: {
    domains: [
      "shopping-phinf.pstatic.net",
      "gocamping.or.kr",
      "sjnpgqafckrncydthmis.supabase.co",
    ],
  },
};

export default nextConfig;
