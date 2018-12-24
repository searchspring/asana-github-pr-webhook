const processor = require('./src/processor')
const { json, send } = require('micro')
const verifySecret = require('verify-github-webhook-secret')
const logInfo = require('debug')('agpw:webhook:info')
const logTrace = require('debug')('agpw:webhook:trace')
const logError = require('debug')('agpw:webhook:error')
const logDebug = require('debug')('agpw:webhook:debug')

module.exports = async (req, res) => {
  logTrace('request')
  const webhookSecret = process.env.WEBHOOK_SECRET
  const asanaAccessToken = process.env.ASANA_ACCESS_TOKEN
  const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN

  if (!webhookSecret) {
    var noWebhookMessage = 'No WEBHOOK_SECRET set so wont run any thing'
    logError(noWebhookMessage)
    send(res, 403, noWebhookMessage)
    return
  }

  if (!asanaAccessToken) {
    var noAsanaMessage = 'No ASANA_ACCESS_TOKEN set so wont run any thing'
    logError(noAsanaMessage)
    send(res, 403, noAsanaMessage)
    return
  }

  if (!githubAccessToken) {
    var noGithubMessage = 'No GITHUB_ACCESS_TOKEN set so wont run any thing'
    logError(noGithubMessage)
    send(res, 403, noGithubMessage)
    return
  }

  logInfo('starting with: ')
  logInfo('WEBHOOK_SECRET=: ********' + webhookSecret.slice(-4))
  logInfo('ASANA_ACCESS_TOKEN=: ********' + asanaAccessToken.slice(-4))
  logInfo('GITHUB_ACCESS_TOKEN=: ********' + githubAccessToken.slice(-4))

  if (req.headers['x-github-event'] !== 'pull_request') {
    var unsupportedEventMessage = 'Only supports github events of type pull request'
    logError(unsupportedEventMessage)
    send(res, 403, unsupportedEventMessage)
    return
  }

  const data = await json(req)
  logDebug('data: ' + data)

  const valid = await verifySecret(req, webhookSecret)

  if (!valid) {
    var secretMismatchError = 'Webhook secret does not match environment variable.'
    logError(secretMismatchError)
    send(res, 403, secretMismatchError)
    return
  }

  await processor.processWebhook(data)

  logTrace('request complete')
  res.end('worked')
}
