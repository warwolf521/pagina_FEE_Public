/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                // Add optional pathname to further restrict which images are allowed
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
