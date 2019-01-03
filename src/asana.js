const xmlescape = require('xml-escape')
var asanator = require('./asanator')
const log = require('debug-with-levels')('agpw:asana')

module.exports.addGithubPrToAsanaTask = async function (githubData, asanaData, replacementAsanator) {
  log.trace('addGithubPrToAsanaTask')
  if (replacementAsanator) {
    asanator = replacementAsanator
  }
  var comment = ''
  comment += '<strong>Linked PR:</strong> ' + xmlescape(githubData.title) + '\n<a href="' + githubData.url + '"/>'
  log.debug('comment: ' + comment)
  await asanator.addComment(asanaData.gid, comment)
}

module.exports.getMatchingAsanaTask = async function (id, replacementAsanator) {
  log.trace('getMatchingAsanaTask')
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
      log.error(error)
      return null
    }
    callsMade++
    lookedAt += rows.length
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].gid.toString().endsWith(id)) {
        log.info(lookedAt + ' records looked at, ' + callsMade + ' calls to asana api - found: ' + JSON.stringify(rows[i]))
        return rows[i]
      }
    }
    d1.setHours(d1.getHours() - hoursInc)
  }

  log.info('failed to find id: ' + id + ' in ' + callsMade + ' calls to asana api')
  return null
}
