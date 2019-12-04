require('dotenv').config()

const isProd = process.env.NODE_ENV === 'production'

const express = require('express')
const next = require('next')
const nextI18NextMiddleware = require('next-i18next/middleware').default

const nextI18next = require('./i18n')

const port = process.env.PORT || 3000
const app = next({ dev: !isProd })
const handle = app.getRequestHandler();

const Sentry = require('@sentry/node')
const fs = require('fs')

app.prepare().then(() => {
  const server = express()

  if (isProd) {
    const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8')
    Sentry.init({
      dsn: process.env.SENTRY_PUBLIC_DSN,
      release: `dogsite:${buildId}`
    })
    server.use(Sentry.Handlers.requestHandler())
  }

  server.use(nextI18NextMiddleware(nextI18next))

  server.get('*', (req, res) => handle(req, res))

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
