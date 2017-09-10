import debug from 'debug'
import uuid from 'uuid-v4'

debug('flowai:unique')

// Private class
class Unique {

  constructor(clientId, key, value) {
    if(typeof clientId !== 'string' || !clientId.length) {
      throw new Error('Invalid clientId provided')
    }

    if(typeof key !== 'string' || key.length < 2) {
      throw new Error('Invalid key provided')
    }

    this._storageKey = `${clientId}.${key}`
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

  /**
   * See if a key exists in storageKey
   **/
  static exists(clientId, key) {
    if(typeof clientId !== 'string' || !clientId.length) {
      throw new Error('Invalid clientId provided')
    }

    if(typeof key !== 'string' || !key.length) {
      throw new Error('Invalid key provided')
    }

    let localStorage
    if (typeof localStorage === "undefined" || localStorage === null) {
      const LocalStorage = require('node-localstorage').LocalStorage
      localStorage = new LocalStorage('./unique')
    } else {
      localStorage = window.localStorage
    }

    const storageKey = `${clientId}.${key}`
    return (localStorage && localStorage.getItem(storageKey) !== null)
  }
}

export default Unique
