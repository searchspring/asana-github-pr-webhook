const github = require('./github')
const asana = require('./asana')
const logInfo = require('debug')('agpw:processor:info')
const logTrace = require('debug')('agpw:processor:trace')
const logDebug = require('debug')('agpw:processor:debug')

module.exports.processWebhook = async function (data, replacementAsanator, replacementGithubator) {
  logTrace('processWebhook')
  if (!github.shouldProcess(data)) {
    logInfo('skipping as no change')
    return
  }

  // get asana prefix id
  var asanaId = github.getAsanaId(data)
  logDebug('Found asana id: ' + asanaId)

  // get real asana id
  var asanaData = await asana.getMatchingAsanaTask(asanaId, replacementAsanator)
  logDebug('Found asana task: ' + asanaData)

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
