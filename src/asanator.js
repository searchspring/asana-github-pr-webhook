var request = require('async-request')
/**
 * All the http requests to asana
 */
module.exports.asanaAccessToken = process.env.ASANA_ACCESS_TOKEN

module.exports.addComment = async function (gid, comment) {
  try {
    var options = createOptions()
    options.data = { 'html_text': '<body>' + comment + '</body>' }
    options.method = 'POST'
    await request('https://app.asana.com/api/1.0/tasks/' + gid + '/stories', options)
  } catch (error) {
    console.error(error)
  }
}

module.exports.searchByDate = async function (before, after) {
  try {
    var options = createOptions()
    var url = 'https://app.asana.com/api/1.0/workspaces/6997325340207/tasks/search' +
      '?opt_fields=gid,name' +
      '&modified_at.before=' + before.toISOString() +
      '&modified_at.after=' + after.toISOString() +
      '&limit=100' +
      '&sort_by=modified_at'
    var res = await request(url, options)
    var result = JSON.parse(res.body)
    return result && result.data ? result.data : []
  } catch (error) {
    console.error(error)
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
