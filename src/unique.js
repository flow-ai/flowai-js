import debug from 'debug'
import uuid from 'uuid-v4'

const reqqq = require

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
    if(value !== null && value !== undefined) {
      this._storage.setItem(this._storageKey, value)
    }
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
    return (storage.getItem(storageKey) !== null)
  }
}


const createStorage = engine => {
  if (typeof document !== 'undefined') {
    // Web

    if (typeof localStorage === "undefined" || localStorage === null) {
      // Very old browser?
      return memoryStore()
    }

    if(engine === 'session') {
      // Session store
      return sessionStorage
    }
    return localStorage

  } else if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
    // React native
    return memoryStore()
  } else {
    // Nodejs
    const LocalStorage = reqqq('node-localstorage').LocalStorage
    return new LocalStorage('./unique')
  }
}

const __stored = {}

const memoryStore = () => {
  return ({
    getItem: storageKey => __stored[storageKey] || null,
    setItem: (storageKey, value) => {
      __stored[storageKey] = value
    }
  })
}

export default Unique
