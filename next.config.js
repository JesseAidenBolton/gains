/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    env: {
        DATABASE_URL: process.env.DATABASE_URL
    }
}

module.exports = nextConfig
