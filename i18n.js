const NextI18Next = require('next-i18next').default

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['fr']
})

const Module = module.exports = NextI18NextInstance

Module.appWithTranslation = NextI18NextInstance.appWithTranslation

Module.withTranslation = NextI18NextInstance.withTranslation
