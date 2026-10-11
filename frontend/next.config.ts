import type { NextConfig } from 'next';

// Routes that moved under a space prefix; keeps old links and bookmarks working
const CREATOR_ROUTES = [
  'home',
  'videos',
  'video',
  'scripts',
  'projects',
  'performance',
  'followers',
  'automations',
  'competitors',
  'library',
  'exports',
  'channels',
  'design-system',
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/community', destination: '/community/feed', permanent: false },
      { source: '/creator', destination: '/creator/home', permanent: false },
      ...CREATOR_ROUTES.flatMap((route) => [
        { source: `/${route}`, destination: `/creator/${route}`, permanent: false },
        { source: `/${route}/:path*`, destination: `/creator/${route}/:path*`, permanent: false },
      ]),
      { source: '/challenges', destination: '/community/challenges', permanent: false },
    ];
  },
};

export default nextConfig;
