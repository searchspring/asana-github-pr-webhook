var request = require('async-request')
const logInfo = require('debug')('agpw:asanator:info')
const logTrace = require('debug')('agpw:asanator:trace')
const logError = require('debug')('agpw:asanator:error')
const logDebug = require('debug')('agpw:asanator:debug')
/**
 * All the http requests to asana
 */
module.exports.asanaAccessToken = process.env.ASANA_ACCESS_TOKEN

module.exports.addComment = async function (gid, comment) {
  logTrace('addComment')
  try {
    var options = createOptions()
    options.data = { 'html_text': '<body>' + comment + '</body>' }
    options.method = 'POST'
    var url = 'https://app.asana.com/api/1.0/tasks/' + gid + '/stories'
    logDebug(url)
    var res = await request(url, options)
    logInfo('added comment')
    logDebug(res)
  } catch (error) {
    logError(error)
  }
}

module.exports.searchByDate = async function (before, after) {
  logTrace('searchByDate')
  try {
    var options = createOptions()
    var url = 'https://app.asana.com/api/1.0/workspaces/6997325340207/tasks/search' +
      '?opt_fields=gid,name' +
      '&modified_at.before=' + before.toISOString() +
      '&modified_at.after=' + after.toISOString() +
      '&limit=100' +
      '&sort_by=modified_at'
    logDebug(url)
    var res = await request(url, options)
    var result = JSON.parse(res.body)
    logDebug(result)
    return result && result.data ? result.data : []
  } catch (error) {
    logError(error)
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
