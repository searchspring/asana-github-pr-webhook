const githubator = require('./githubator')
const getPort = require('get-port')
var http = require('http')

test('call out', async () => {
  githubator.githubAccessToken = 'test_token'
  let port = await getPort()
  let calls = 0
  let body = ''
  let headers = ''
  let server = http.createServer(function (req, res) {
    headers = req.headers
    calls++
    req.on('data', chunk => {
      body = `${chunk}`
    })
    res.end()
  }).listen(port)

  await githubator.addComment(`http://localhost:${port}`, 'message')
  server.close()
  expect(calls).toEqual(1)
  expect(body).toEqual(`{"body":"message"}`)
  expect(headers['authorization']).toEqual(`token ${githubator.githubAccessToken}`)
})
