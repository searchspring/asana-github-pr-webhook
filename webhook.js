const processor = require('./src/processor')
const { json } = require('micro')

const verifySecret = require('verify-github-webhook-secret')

/* global send */
module.exports = async (req, res) => {
  if (req.headers['x-github-event'] !== 'pull_request') {
    var unsupportedEventMessage = 'Only supports github events of type pull request'
    console.log(unsupportedEventMessage)
    send(res, 403, unsupportedEventMessage)
    return
  }

  const data = await json(req)
  const secret = process.env.WEBHOOK_SECRET

  if (!secret) {
    var noWebhookMessage = 'No WEBHOOK_SECRET set so wont run any thing'
    console.log(noWebhookMessage)
    send(res, 403, noWebhookMessage)
    return
  }

  const valid = await verifySecret(req, secret)

  if (!valid) {
    var secretMismatchError = 'Webhook secret does not match environment variable.'
    console.log(secretMismatchError)
    send(res, 403, secretMismatchError)
    return
  }

  await processor.processWebhook(data)

  res.end('worked')
}
