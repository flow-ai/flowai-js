import debug from 'debug'
import uuid from 'uuid-v4'

debug('flowai:unique')

// Private class
class Unique {

  constructor(key, value) {

    if(typeof key !== 'string' || key.length < 2) {
      throw new Error('Invalid key provided')
    }

    this._storageKey = key
    debug(`Creating a new Unique with key '${key}' and value '${value}'`)

    if (typeof localStorage === "undefined" || localStorage === null) {
      debug(`No LocalStorage (node) so creating one`)
      const LocalStorage = require('node-localstorage').LocalStorage
      this._localStorage = new LocalStorage('./unique')
    } else {
      this._localStorage = localStorage
    }

    value && this._localStorage.setItem(this._storageKey, value)
  }

  id() {
    let uniqueId = this._localStorage.getItem(this._storageKey)
    if(!uniqueId) {
      // Remove dashes
      uniqueId = uuid().replace(/-/g, '')

      debug(`Creating a new uniqueId '${uniqueId}'`)

      this._localStorage.setItem(this._storageKey, uniqueId)
    }

    debug(`Returning uniqueId '${uniqueId}'`)

    return uniqueId
  }
}

export default Unique
