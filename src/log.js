const debug = require('debug')

class Logger {
  constructor (name) {
    this.ltrace = debug(name + ':trace')
    this.ldebug = debug(name + ':debug')
    this.linfo = debug(name + ':info')
    this.lwarn = debug(name + ':warn')
    this.lerror = debug(name + ':error')
  }
  info (msg) {
    this.linfo(msg)
  }
  error (msg) {
    this.lerror(msg)
  }
  trace (msg) {
    this.ltrace(msg)
  }
  warn (msg) {
    this.lwarn(msg)
  }
  debug (msg) {
    this.ldebug(msg)
  }
}
module.exports = (name) => {
  return new Logger(name)
}
