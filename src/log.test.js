const log = require('./log')('agwp:log.test')
const debug = require('debug')

var value = null
debug.enable('agwp:log.test:*')
debug.log = (msg) => {
  value = msg
}
test('test logger info', () => {
  log.info('something')
  expect(value).toMatch('agwp:log.test:info')
  expect(value).toMatch('something')
})
test('test logger error', () => {
  log.error('something')
  expect(value).toMatch('agwp:log.test:error')
  expect(value).toMatch('something')
})
test('test logger trace', () => {
  log.trace('something')
  expect(value).toMatch('agwp:log.test:trace')
  expect(value).toMatch('something')
})
test('test logger warn', () => {
  log.warn('something')
  expect(value).toMatch('agwp:log.test:warn')
  expect(value).toMatch('something')
})
test('test logger debug', () => {
  log.debug('something')
  expect(value).toMatch('agwp:log.test:debug')
  expect(value).toMatch('something')
})
