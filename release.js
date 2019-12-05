require('dotenv').config()

const org = process.env.SENTRY_ORG
const project = process.env.SENTRY_PROJECT
const token = process.env.SENTRY_AUTH_TOKEN
const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8')

const { execSync } = require('child_process')
const cli = './node_modules/@sentry/cli/bin/sentry-cli'

execSync(`${cli} releases --org ${org} --project ${project} new ${buildId}`)
execSync(`${cli} releases --org ${org} --project ${project} files ${buildId} upload-sourcemaps .next`)
execSync(`${cli} releases --org ${org} --project ${project} finalize ${buildId}`)
