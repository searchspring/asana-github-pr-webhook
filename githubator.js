var request = require('async-request')

module.exports.githubAccessToken = process.env.GITHUB_ACCESS_TOKEN

module.exports.addComment = async function (apiUrl, message) {
  try {
    var url = apiUrl + '/comments?access_token=' + module.exports.githubAccessToken
    await request(url,
      {
        'method': 'POST',
        'headers': {
          'User-Agent': 'webhook processor'
        },
        'data': JSON.stringify({ 'body': message })
      })
  } catch (error) {
    console.error(error)
  }
}
