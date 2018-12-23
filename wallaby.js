module.exports = function (wallaby) {
  process.env.ASANA_ACCESS_TOKEN = 'my-fake-access-token'

  return {
    files: [
      '*.js',
      { pattern: '*.test.js', ignore: true },
      { pattern: 'wallaby.js', ignore: true }
    ],
    tests: [
      '*.test.js'
    ],
    env: {
      type: 'node'
    },
    testFramework: 'jest'
  }
}
