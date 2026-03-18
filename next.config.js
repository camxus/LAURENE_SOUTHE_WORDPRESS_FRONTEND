/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "srv1501677.hstgr.cloud", pathname: "/**" },
      { protocol: "http",  hostname: "srv1501677.hstgr.cloud", pathname: "/**" },
    ],
  },
};
