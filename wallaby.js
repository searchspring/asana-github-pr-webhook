module.exports = function (wallaby) {
  process.env.ASANA_ACCESS_TOKEN = 'my-fake-access-token'

  return {
    files: [
      'src/*.js',
      { pattern: 'src/*.test.js', ignore: true }
    ],
    tests: [
      'src/*.test.js'
    ],
    env: {
      type: 'node'
    },
    testFramework: 'jest'
  }
}
