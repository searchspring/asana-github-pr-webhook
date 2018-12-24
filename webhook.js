const processor = require('./src/processor')
const log = require('./src/log')('agpw:webhook')
const { json, send } = require('micro')
const verifySecret = require('verify-github-webhook-secret')

module.exports = async (req, res) => {
  log.trace('request')
  const webhookSecret = process.env.WEBHOOK_SECRET
  const asanaAccessToken = process.env.ASANA_ACCESS_TOKEN
  const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN

  if (!webhookSecret) {
    var noWebhookMessage = 'No WEBHOOK_SECRET set so wont run any thing'
    log.error(noWebhookMessage)
    send(res, 403, noWebhookMessage)
    return
  }

  if (!asanaAccessToken) {
    var noAsanaMessage = 'No ASANA_ACCESS_TOKEN set so wont run any thing'
    log.error(noAsanaMessage)
    send(res, 403, noAsanaMessage)
    return
  }

  if (!githubAccessToken) {
    var noGithubMessage = 'No GITHUB_ACCESS_TOKEN set so wont run any thing'
    log.error(noGithubMessage)
    send(res, 403, noGithubMessage)
    return
  }

  log.info('starting with: ')
  log.info('WEBHOOK_SECRET=: ********' + webhookSecret.slice(-4))
  log.info('ASANA_ACCESS_TOKEN=: ********' + asanaAccessToken.slice(-4))
  log.info('GITHUB_ACCESS_TOKEN=: ********' + githubAccessToken.slice(-4))

  if (req.headers['x-github-event'] !== 'pull_request') {
    var unsupportedEventMessage = 'Only supports github events of type pull request'
    log.error(unsupportedEventMessage)
    send(res, 403, unsupportedEventMessage)
    return
  }

  const data = await json(req)
  log.debug('data: ' + data)

  const valid = await verifySecret(req, webhookSecret)

  if (!valid) {
    var secretMismatchError = 'Webhook secret does not match environment variable.'
    log.error(secretMismatchError)
    send(res, 403, secretMismatchError)
    return
  }

  await processor.processWebhook(data)

  log.trace('request complete')
  res.end('worked')
}
