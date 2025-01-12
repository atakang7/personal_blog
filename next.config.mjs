// next.config.js
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,    // Opens in browser automatically
  analyzerMode: 'static',  // Generates HTML files
  analyzerPort: 8888,
});

const nextConfig = {
  output: 'standalone',
  compress: true,
  images: {
    domains: ['static.atakangul.com', 'www.atakangul.com'],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default withBundleAnalyzer(nextConfig);