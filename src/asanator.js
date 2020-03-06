var axios = require('axios')
const log = require('debug-with-levels')('agpw:asanator')
/**
 * All the http requests to asana
 */
module.exports.asanaAccessToken = process.env.ASANA_ACCESS_TOKEN
module.exports.workspaceId = process.env.WORKSPACE_ID

module.exports.addComment = async function (gid, comment) {
  log.trace('addComment')
  try {
    var options = createOptions()
    var data = { 'data': { 'is_pinned': true, 'html_text': '<body>' + comment + '</body>' } }
    var url = 'https://app.asana.com/api/1.0/tasks/' + gid + '/stories'
    log.debug(url, data, options)
    var res = await axios.post(url, data, options)
    log.debug(res)
    log.info('added comment')
  } catch (error) {
    log.error(error)
  }
}

module.exports.searchByDate = async function (before, after) {
  log.trace('searchByDate')
  try {
    var options = createOptions()
    var url = 'https://app.asana.com/api/1.0/workspaces/' + module.exports.workspaceId + '/tasks/search' +
      '?opt_fields=gid,name' +
      '&modified_at.before=' + before.toISOString() +
      '&modified_at.after=' + after.toISOString() +
      '&limit=100' +
      '&sort_by=modified_at'
    log.debug(url, options)
    var res = await axios.get(url, options)
    log.debug(res)
    return res && res.data && res.data.data ? res.data.data : []
  } catch (error) {
    log.error(error)
    return []
  }
}

function createOptions () {
  var options = {
    'headers': {
      'Authorization': 'Bearer ' + module.exports.asanaAccessToken
    }
  }
  return options
}
