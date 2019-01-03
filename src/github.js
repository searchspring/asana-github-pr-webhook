var githubator = require('./githubator')
var xmlescape = require('xml-escape')
const log = require('debug-with-levels')('agpw:github')

/**
 * Find possible asana ids in various parts of the pull request webhook body.
 * @param {string} data a PR event body from github
 */
module.exports.getAsanaId = function (data) {
  var title = data['pull_request']['title']
  var body = data['pull_request']['body']
  return match(title) || match(body)
}

module.exports.addAsanaTaskToGithubPr = async function (githubData, asanaData, replacementGithubator) {
  log.trace('addAsanaTaskToGithubPr')
  if (replacementGithubator) {
    githubator = replacementGithubator
  }
  var url = 'https://app.asana.com/0/0/' + asanaData.gid
  var comment = '<strong>Linked Asana:</strong> ' + xmlescape(asanaData.name) + '\n<a href="' + url + '">' + url + '</a>'
  await githubator.addComment(githubData.apiUrl, comment)
}

module.exports.shouldProcess = function (data) {
  log.trace('shouldProcess')
  var action = data.action
  if (action !== 'edited' && action !== 'opened') {
    return false
  }

  var id = module.exports.getAsanaId(data)
  var changedTitle = data.changes && data.changes.title && data.changes.title.from ? data.changes.title.from : null
  var changedBody = data.changes && data.changes.body && data.changes.body.from ? data.changes.body.from : null

  if (action === 'opened' && id !== null) {
    return true
  }
  if (changedTitle === null && changedBody === null) {
    return false
  }
  var changeId = match(changedTitle) || match(changedBody)
  return id != null && id !== changeId
}

function match (toMatch) {
  if (!toMatch) {
    return null
  }
  var match = /^([0-9]{4,10})\s+.*/.exec(toMatch)
  return match != null ? match[1] : null
}
