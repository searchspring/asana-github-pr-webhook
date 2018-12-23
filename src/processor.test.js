const processor = require('./processor')
const asanator = require('./asanator')
const githubator = require('./githubator')

var eventData = {
  'action': 'closed',
  'number': 1,
  'pull_request': {
    'url': 'https://api.github.com/repos/Codertocat/Hello-World/pulls/1',
    'title': '9833 Update the README with new information'
  }
}
const asanaTask = {
  'gid': '955082368419833',
  'id': 955082368419833,
  'modified_at': '2018-12-21T22:49:30.930Z',
  'name': 'Ops Blog Review'
}

test('process test', async () => {
  asanator.asanaAccessToken = 'temp'
  githubator.githubAccessToken = 'temp'

  asanator.searchByDate = function () {
    return [asanaTask]
  }
  asanator.addComment = function () {
    return ''
  }
  githubator.addComment = function () {
    return ''
  }
  await processor.processWebhook(eventData, asanator, githubator)
})
