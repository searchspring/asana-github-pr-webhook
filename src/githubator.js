var request = require('async-request')
const log = require('./log')('agpw:githubator')

/**
 * All the http requests to github.
 */
module.exports.githubAccessToken = process.env.GITHUB_ACCESS_TOKEN

module.exports.addComment = async function (apiUrl, message) {
  log.trace('addComment')
  try {
    var url = apiUrl + '/comments?access_token=' + module.exports.githubAccessToken
    log.debug(url)
    var res = await request(url,
      {
        'method': 'POST',
        'headers': {
          'User-Agent': 'webhook processor'
        },
        'data': JSON.stringify({ 'body': message })
      })
    log.debug(res)
  } catch (error) {
    log.error(error)
  }
}
