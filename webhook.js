const processor = require('./src/processor')
const { json, send } = require('micro')
const verifySecret = require('verify-github-webhook-secret')

module.exports = async (req, res) => {
  const webhookSecret = process.env.WEBHOOK_SECRET
  const asanaAccessToken = process.env.ASANA_ACCESS_TOKEN
  const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN

  if (!webhookSecret) {
    var noWebhookMessage = 'No WEBHOOK_SECRET set so wont run any thing'
    console.log(noWebhookMessage)
    send(res, 403, noWebhookMessage)
    return
  }

  if (!asanaAccessToken) {
    var noAsanaMessage = 'No ASANA_ACCESS_TOKEN set so wont run any thing'
    console.log(noAsanaMessage)
    send(res, 403, noAsanaMessage)
    return
  }

  if (!githubAccessToken) {
    var noGithubMessage = 'No GITHUB_ACCESS_TOKEN set so wont run any thing'
    console.log(noGithubMessage)
    send(res, 403, noGithubMessage)
    return
  }

  console.log('starting with: ')
  console.log('WEBHOOK_SECRET=: ********' + webhookSecret.slice(-4))
  console.log('ASANA_ACCESS_TOKEN=: ********' + asanaAccessToken.slice(-4))
  console.log('GITHUB_ACCESS_TOKEN=: ********' + githubAccessToken.slice(-4))

  if (req.headers['x-github-event'] !== 'pull_request') {
    var unsupportedEventMessage = 'Only supports github events of type pull request'
    console.log(unsupportedEventMessage)
    send(res, 403, unsupportedEventMessage)
    return
  }

  console.log('here')
  const data = await json(req)
  console.log('there')

  const valid = await verifySecret(req, webhookSecret)

  if (!valid) {
    var secretMismatchError = 'Webhook secret does not match environment variable.'
    console.log(secretMismatchError)
    send(res, 403, secretMismatchError)
    return
  }

  await processor.processWebhook(data)

  res.end('worked')
}
