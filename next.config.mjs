/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'res.cloudinary.com',
          pathname: '/dmmpngwym/image/upload/**', // Match the path to your image location
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/dmmpngwym/image/upload/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  