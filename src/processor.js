const github = require('./github')
const asana = require('./asana')
const log = require('debug-with-levels')('agpw:processor')

module.exports.processWebhook = async function (data, replacementAsanator, replacementGithubator) {
  log.trace('processWebhook')
  if (!github.shouldProcess(data)) {
    log.info('skipping as no change')
    return
  }

  // get asana prefix id
  var asanaId = github.getAsanaId(data)
  log.debug('Found asana id: ' + asanaId)

  // get real asana id
  var asanaData = await asana.getMatchingAsanaTask(asanaId, replacementAsanator)
  log.debug('Found asana task: ' + JSON.stringify(asanaData))

  if (asanaData) {
    // put github link on asana
    var githubData = {}
    githubData.url = data.pull_request.html_url
    githubData.apiUrl = data.pull_request.issue_url
    githubData.title = data.pull_request.title
    await asana.addGithubPrToAsanaTask(githubData, asanaData, replacementAsanator)

    // put asana link on github
    await github.addAsanaTaskToGithubPr(githubData, asanaData, replacementGithubator)
  }
}
