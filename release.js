require('dotenv').config()

const fetch = require('isomorphic-unfetch')
const fs = require('fs')

const token = process.env.SENTRY_AUTH_TOKEN
const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8')

const HEAD = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim()

fetch(`https://sentry.io/api/0/organizations/itsfadnis/releases/`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    version: buildId,
    refs: [{
      repository: 'itsfadnis/dogsite',
      commit: HEAD
    }],
    url: 'https://github.com/itsfadnis/dogsite',
    projects: ['dogsite']
  })
}).then((response) => {
  if (response.ok) {
    console.log(`Release success! :) ${buildId}`)
  } else {
    console.log(`Release fail :(`)
  }
})
