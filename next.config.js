const Dotenv = require('dotenv-webpack')
const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map'
})

module.exports = withSourceMaps({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config

    // Example using webpack option
    // config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))
    config.plugins.push(
      new Dotenv()
    )

    if (!dev) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.BUILD_ID': JSON.stringify(buildId)
        })
      )
    }

    return config
  }
})
