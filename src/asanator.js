var request = require('async-request')
const log = require('./log')('agpw:asanator')
/**
 * All the http requests to asana
 */
module.exports.asanaAccessToken = process.env.ASANA_ACCESS_TOKEN

module.exports.addComment = async function (gid, comment) {
  log.trace('addComment')
  try {
    var options = createOptions()
    options.data = { 'html_text': '<body>' + comment + '</body>' }
    options.method = 'POST'
    var url = 'https://app.asana.com/api/1.0/tasks/' + gid + '/stories'
    log.debug(url)
    var res = await request(url, options)
    log.info('added comment')
    log.debug(res)
  } catch (error) {
    log.error(error)
  }
}

module.exports.searchByDate = async function (before, after) {
  log.trace('searchByDate')
  try {
    var options = createOptions()
    var url = 'https://app.asana.com/api/1.0/workspaces/6997325340207/tasks/search' +
      '?opt_fields=gid,name' +
      '&modified_at.before=' + before.toISOString() +
      '&modified_at.after=' + after.toISOString() +
      '&limit=100' +
      '&sort_by=modified_at'
    log.debug(url)
    var res = await request(url, options)
    var result = JSON.parse(res.body)
    log.debug(result)
    return result && result.data ? result.data : []
  } catch (error) {
    log.error(error)
    return []
  }
}

function createOptions () {
  var options = {
    'headers': {
      'Authorization': 'Bearer ' + module.exports.asanaAccessToken
    },
    'method': 'GET'
  }
  return options
}
