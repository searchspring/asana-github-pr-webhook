module.exports = function (wallaby) {
  return {
    files: [
      'src/*.js',
      'webhook.js',
      { pattern: '**/*.test.js', ignore: true }
    ],
    tests: [
      '**/*.test.js'
    ],
    env: {
      type: 'node'
    },
    testFramework: 'jest'
  }
}
