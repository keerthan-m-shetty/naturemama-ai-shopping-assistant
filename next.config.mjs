/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Amplify S3 storage bucket (update with your actual bucket domain)
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        // CloudFront CDN (update with your distribution domain)
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
