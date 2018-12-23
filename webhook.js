const processor = require('./processor');
const { json } = require('micro');

const verifySecret = require('verify-github-webhook-secret');

module.exports = async (req, res) => {
  if (req.headers['x-github-event'] !== 'pull_request') {
    var msg = 'Only supports github events of type pull request';
    console.log(msg);
    send(res, 403, msg);
    return;
  }

  const data = await json(req);
  const secret = process.env.WEBHOOK_SECRET;

  if (!secret) {
    var msg = 'No WEBHOOK_SECRET set so wont run any thing';
    console.log(msg);
    send(res, 403, msg);
    return;
  }

  const valid = await verifySecret(req, secret);

  if (!valid) {
    var msg = 'Webhook secret does not match environment variable.';
    console.log(msg);
    send(res, 403, msg);
    return;
  }
  
  await processor.processWebhook(data);

  res.end('worked');

}