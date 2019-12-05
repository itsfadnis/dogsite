const Dotenv = require('dotenv-webpack')
const withSourceMaps = require('@zeit/next-source-maps')()
const SentryCliPlugin = require('@sentry/webpack-plugin')

const isHeroku = process.env.HEROKU === 'true'

if (!isHeroku) {
  require('dotenv').config()
}

module.exports = withSourceMaps({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config

    // Example using webpack option
    // config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))
    if (dev) {
      config.plugins.push(new Dotenv())
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_ID': JSON.stringify(buildId),
        'process.env.SENTRY_PUBLIC_DSN': JSON.stringify(process.env.SENTRY_PUBLIC_DSN),
        'process.env.SENTRY_AUTH_TOKEN': JSON.stringify(process.env.SENTRY_AUTH_TOKEN),
        'process.env.SENTRY_PROJECT': JSON.stringify(process.env.SENTRY_PROJECT),
        'process.env.SENTRY_ORG': JSON.stringify(process.env.SENTRY_ORG),
        'process.env.SENTRY_SECURITY_TOKEN': JSON.stringify(process.env.SENTRY_SECURITY_TOKEN)
      }),
    )

    if (!dev) {
      config.plugins.push(
        new SentryCliPlugin({
          release: buildId,
          include: '.next',
          configFile: 'sentry.properties'
        })
      )
    }

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    return config
  }
})
