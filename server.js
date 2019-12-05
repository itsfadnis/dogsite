const isProd = process.env.NODE_ENV === 'production'
const isHeroku = process.env.HEROKU === 'true'

if (isHeroku) {
  // Create a .sentryclirc
  // Sentry webpack plugin reads this file
  const fs = require('fs')
  const content = [
    '[defaults]',
    `org=${process.env.SENTRY_ORG}`,
    `project=${process.env.SENTRY_PROJECT}`,
    '[auth]',
    `token=${process.env.SENTRY_AUTH_TOKEN}`
  ].join('\n')
  fs.writeFileSync('sentry.properties', content)
} else {
  require('dotenv').config()
}

const express = require('express')
const next = require('next')
const nextI18NextMiddleware = require('next-i18next/middleware').default

const nextI18next = require('./i18n')

const port = process.env.PORT || 3000
const app = next({ dev: !isProd })
const handler = app.getRequestHandler()

const sourcemapsForSentryOnly = token => (req, res, next) => {
  // In production we only want to serve source maps for Sentry
  if (isProd && !!token && req.headers['secretsecuritytoken'] !== token) {
    res
      .status(401)
      .send('Authentication access token is required to access the source map.')
    return
  }
  next()
}

app.prepare().then(() => {
  // app.buildId is only available after app.prepare(), hence why we setup here
  const { Sentry } = require('./lib/sentry')(app.buildId)

  const server = express()

  server.use(nextI18NextMiddleware(nextI18next))

  server
    .use(Sentry.Handlers.requestHandler())
    .get(/\.map$/, sourcemapsForSentryOnly(process.env.SENTRY_SECURITY_TOKEN))
    // Regular next.js request handler
    .use(handler)
    // This handles errors if they are thrown before reaching the app
    .use(Sentry.Handlers.errorHandler())
    .listen(port, err => {
      if (err) {
        throw err
      }
      // eslint-disable-next-line no-console
      console.log(`> Ready on http://localhost:${port}`)
    })
})
