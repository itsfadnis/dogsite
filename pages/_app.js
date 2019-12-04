import React from 'react'
import App from 'next/app'
import { appWithTranslation } from '../i18n'
import * as Sentry from '@sentry/browser';

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  Sentry.init({ dsn: process.env.SENTRY_PUBLIC_DSN })
}

class MyApp extends App {
  componentDidCatch (error, errorInfo) {
    if (isProd) {
      Sentry.configureScope(scope => {
        Object.keys(errorInfo).forEach(key => {
          scope.setExtra(key, errorInfo[key])
        })
      })
      Sentry.captureException(error)
    }
    // This is needed to render errors correctly in development/production
    super.componentDidCatch(error, errorInfo)
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Component {...pageProps} />
    )
  }
}

export default appWithTranslation(MyApp)
