/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      // Shorthand proxy paths (legacy Vite-era aliases)
      { source: '/sec-proxy', destination: '/api/sec-proxy' },
      { source: '/sec-proxy/:path*', destination: '/api/sec-proxy?path=:path*' },
      { source: '/sec-data', destination: '/api/sec-proxy?upstream=data' },
      { source: '/sec-data/:path*', destination: '/api/sec-proxy?upstream=data&path=:path*' },
      { source: '/sec-efts', destination: '/api/sec-proxy?upstream=efts' },
      { source: '/sec-efts/:path*', destination: '/api/sec-proxy?upstream=efts&path=:path*' },
      // EDGAR asset proxying (iXBRL viewer, archives, static assets)
      { source: '/ix/:path*', destination: '/api/sec-proxy?path=ix/:path*' },
      { source: '/ixviewer/:path*', destination: '/api/sec-proxy?path=ixviewer/:path*' },
      { source: '/Archives/:path*', destination: '/api/sec-proxy?path=Archives/:path*' },
      { source: '/include/:path*', destination: '/api/sec-proxy?path=include/:path*' },
      { source: '/files/:path*', destination: '/api/sec-proxy?path=files/:path*' },
      { source: '/cdata/:path*', destination: '/api/sec-proxy?path=cdata/:path*' },
    ];
  },
};

export default nextConfig;
