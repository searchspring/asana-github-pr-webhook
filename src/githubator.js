var axios = require('axios')
const log = require('debug-with-levels')('agpw:githubator')

/**
 * All the http requests to github.
 */
module.exports.githubAccessToken = process.env.GITHUB_ACCESS_TOKEN

module.exports.addComment = async function (apiUrl, message) {
  log.trace('addComment')
  try {
    var url = apiUrl + '/comments?access_token=' + module.exports.githubAccessToken
    log.debug(url)
    var res = await axios.post(url, { 'body': message })
    log.debug(res)
  } catch (error) {
    log.error(error)
  }
}
