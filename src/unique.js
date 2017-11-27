import debug from 'debug'
import uuid from 'uuid-v4'

debug('flowai:unique')

// Private class
class Unique {

  constructor(opts) {

    if(typeof opts !== 'object') {
      throw new Error('Required options must be an object')
    }

    const {
      clientId,
      key,
      value,
      engine
    } = opts

    if(typeof clientId !== 'string' || !clientId.length) {
      throw new Error('Invalid clientId provided')
    }

    if(typeof key !== 'string' || key.length < 2) {
      throw new Error('Invalid key provided')
    }

    if(typeof engine !== 'string') {
      throw new Error('Storage engine must be provided, either local or session')
    }

    this._storageKey = `${clientId}.${key}`
    this._storage = createStorage(engine)

    debug(`Creating a new Unique with key '${key}' and value '${value}'`)


    value && this._storage.setItem(this._storageKey, value)
  }

  id() {
    let uniqueId = this._storage.getItem(this._storageKey)
    if(!uniqueId) {
      // Remove dashes
      uniqueId = uuid().replace(/-/g, '')

      debug(`Creating a new uniqueId '${uniqueId}'`)

      this._storage.setItem(this._storageKey, uniqueId)
    }

    debug(`Returning uniqueId '${uniqueId}'`)

    return uniqueId
  }

  /**
   * See if a key exists in storageKey
   **/
  static exists(opts) {

    if(typeof opts !== 'object') {
      throw new Error('Required options must be an object')
    }

    const {
      clientId,
      key,
      engine
    } = opts

    if(typeof clientId !== 'string' || !clientId.length) {
      throw new Error('Invalid clientId provided')
    }

    if(typeof key !== 'string' || !key.length) {
      throw new Error('Invalid key provided')
    }

    if(typeof engine !== 'string') {
      throw new Error('Storage engine must be provided, either local or session')
    }

    const storage = createStorage(engine)
    const storageKey = `${clientId}.${key}`
    return (storage && storage.getItem(storageKey) !== null)
  }
}


const createStorage = (engine) => {
  if (typeof localStorage === "undefined" || localStorage === null) {
    // Server side storage
    const LocalStorage = require('node-localstorage').LocalStorage
    return new LocalStorage('./unique')
  }

  if(engine === 'session') {
    return sessionStorage
  }

  return localStorage
}

export default Unique
