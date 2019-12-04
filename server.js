const isProd = process.env.NODE_ENV === 'production'

const express = require('express')
const next = require('next')
const nextI18NextMiddleware = require('next-i18next/middleware').default

const nextI18next = require('./i18n')

const port = process.env.PORT || 3000
const app = next({ dev: !isProd })
const handle = app.getRequestHandler();

const Sentry = require('@sentry/node')

app.prepare().then(() => {
  const server = express()

  if (isProd) {
    Sentry.init({ dsn: 'https://bcdde8809a6c4c5e83db6cd7d30d9033@sentry.io/1844177' })
    server.use(Sentry.Handlers.requestHandler())
  }

  server.use(nextI18NextMiddleware(nextI18next))

  server.get('*', (req, res) => handle(req, res))

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
