var request = require('async-request')
const logTrace = require('debug')('agpw:githubator:trace')
const logError = require('debug')('agpw:githubator:error')
const logDebug = require('debug')('agpw:githubator:debug')

/**
 * All the http requests to github.
 */
module.exports.githubAccessToken = process.env.GITHUB_ACCESS_TOKEN

module.exports.addComment = async function (apiUrl, message) {
  logTrace('addComment')
  try {
    var url = apiUrl + '/comments?access_token=' + module.exports.githubAccessToken
    logDebug(url)
    var res = await request(url,
      {
        'method': 'POST',
        'headers': {
          'User-Agent': 'webhook processor'
        },
        'data': JSON.stringify({ 'body': message })
      })
    logDebug(res)
  } catch (error) {
    logError(error)
  }
}
