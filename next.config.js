/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns:[
      {protocol: 'https' ,
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**'
      },
      {protocol: 'https' ,
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      },
      {protocol: 'https',
        hostname: 'flowbite.s3.amazonaws.com',
        port: '',
        pathname: '**'
      },
    ]
  },
}

module.exports = nextConfig
