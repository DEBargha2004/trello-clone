/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'img.clerk.com'
      },
      {
        hostname: 'imgs.search.brave.com'
      },
      {
        hostname: 'cdn.pixabay.com'
      },
      {
        hostname: 'pixabay.com'
      }
    ]
  }
}

module.exports = nextConfig
