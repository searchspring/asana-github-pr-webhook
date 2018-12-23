const processor = require('./processor')
const asanator = require('./asanator')
const githubator = require('./githubator')

var eventData = {
  'action': 'opened',
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

  asanator.searchByDate = jest.fn(() => { return [asanaTask] })
  asanator.addComment = jest.fn(() => { })
  githubator.addComment = jest.fn(() => { })

  await processor.processWebhook(eventData, asanator, githubator)

  expect(asanator.searchByDate).toBeCalled()
  expect(asanator.addComment).toBeCalled()
  expect(githubator.addComment).toBeCalled()
})

test('process test aborted', async () => {
  asanator.asanaAccessToken = 'temp'
  githubator.githubAccessToken = 'temp'
  eventData.action = 'closed'
  asanator.searchByDate = jest.fn(() => { })

  await processor.processWebhook(eventData, asanator, githubator)

  expect(asanator.searchByDate).not.toBeCalled()
})
