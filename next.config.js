/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    domains: [
      "via.placeholder.com",
      "dummyimage.com",
      "goldenrama.com",
      "dev-goldenrama.stag-rewardx.insignia.co.id",
      "dl.airtable.com",
      "www.goldenrama.com",
      "preprod-api.goldenrama.com",
      "prod1-api.goldenrama.com",
      "prod1-api.goldenrama.comundefined",
      "stag-api.goldenrama.com",
      "photos.hotelbeds.com",
      "s3.amazonaws.com",
      "grts2.goldenrama.com",
      "localhost",
      "imagedummy.com",
      "flagcdn.com",
      "cdn.bemyguest.com.sgnull",
      "cdn.bemyguest.com.sg",
      "portalvhds11000v9mfhk0k.blob.core.windows.net",
      "grts.traveliteindonesia.com",
      "grts2.goldenrama.com",
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/data/img/program/:filename",
          destination: "/api/img/:filename",
        },
        {
          source: "/data/img/program/thumb/:filename",
          destination: "/api/img/:filename",
        },
        {
          source: "/hotels/order-status",
          destination: "/hotels/order-success",
        },
      ],
    };
  },
  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource, context) {
          // ---- do not bundle astronomia vsop planet data
          if (/\/astronomia\/data$/.test(context)) {
            return !["./deltat.js", "./vsop87Bearth.js"].includes(resource);
          }
          // ---- do not bundle moment locales
          if (/\/moment\/locale$/.test(context)) {
            return true;
          }
          return false;
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
