const xmlescape = require('xml-escape')
var asanator = require('./asanator')
const logInfo = require('debug')('agpw:asana:info')
const logTrace = require('debug')('agpw:asana:trace')
const logError = require('debug')('agpw:asana:error')
const logDebug = require('debug')('agpw:asana:debug')

module.exports.addGithubPrToAsanaTask = async function (githubData, asanaData, replacementAsanator) {
  logTrace('addGithubPrToAsanaTask')
  if (replacementAsanator) {
    asanator = replacementAsanator
  }
  var comment = ''
  comment += '<strong>Linked PR:</strong> ' + xmlescape(githubData.title) + '\n<a href="' + githubData.url + '"/>'
  logDebug('comment: ' + comment)
  await asanator.addComment(asanaData.gid, comment)
}

module.exports.getMatchingAsanaTask = async function (id, replacementAsanator) {
  logTrace('getMatchingAsanaTask')
  if (replacementAsanator) {
    asanator = replacementAsanator
  }
  var d1 = new Date()
  var d2 = new Date(d1)
  var lookedAt = 0
  var callsMade = 0
  var hoursInc = 3
  while (lookedAt < 10000 && callsMade < 100) {
    d2.setHours(d2.getHours() - hoursInc)

    var rows = []
    try {
      rows = await asanator.searchByDate(d1, d2)
    } catch (error) {
      logError(error)
    }
    callsMade++
    lookedAt += rows.length
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].gid.toString().endsWith(id)) {
        logInfo(lookedAt + ' records looked at, ' + callsMade + ' calls to asana api - found: ' + JSON.stringify(rows[i]))
        return rows[i]
      }
    }
    d1.setHours(d1.getHours() - hoursInc)
  }

  logInfo('failed to find id: ' + id + ' in ' + callsMade + ' calls to asana api')
  return null
}
