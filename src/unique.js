import debug from 'debug'
import uuid from 'uuid-v4'

import { setCookie, getCookie } from './cookies'

const reqqq = require

debug('flowai:unique')

/**
 * Generates and stores a unique ID
 * @class
 * @private
 **/
class Unique {

  constructor(opts) {

    if (typeof opts !== 'object') {
      throw new Error('Required options must be an object')
    }

    const {
      clientId,
      key,
      value,
      engine,
      cookiesFallback
    } = opts

    if (typeof clientId !== 'string' || !clientId.length) {
      throw new Error('Invalid clientId provided')
    }

    if (typeof key !== 'string' || key.length < 2) {
      throw new Error('Invalid key provided')
    }

    if (typeof engine !== 'string') {
      throw new Error('Storage engine must be provided, either local or session')
    }

    this._clientId = clientId
    this._key = key
    this._storageKey = `${clientId}.${key}`
    this._storage = createStorage(engine)
    this._cookiesFallback = cookiesFallback

    debug(`Creating a new Unique with key '${key}' and value '${value}'`)
    if (value !== null && value !== undefined) {
      this._storage.setItem(this._storageKey, value)

      if (this._cookiesFallback) {
        setCookie(this._storageKey, value)
      }
    }
  }

  /**
   * Get a unique ID that is stored or generate a new one and store it
   * @returns {string}
   **/
  id() {
    let uniqueId = this._storage.getItem(this._storageKey)
    if (!uniqueId && this._cookiesFallback) {
      uniqueId = getCookie(this._storageKey)
    }
    if (!uniqueId) {
      // Remove dashes
      uniqueId = uuid().replace(/-/g, '')

      if (this._key === 'threadId') {
        const channelId = (atob(this._clientId)).split('|')[1]
        uniqueId = `${uniqueId}|${channelId}`
      }

      debug(`Creating a new uniqueId '${uniqueId}'`)

      this._storage.setItem(this._storageKey, uniqueId)
    }

    debug(`Returning uniqueId '${uniqueId}'`)

    return uniqueId
  }

  /**
   * See if a key exists in storageKey
   * @returns {boolean}
   **/
  static exists(opts) {

    if (typeof opts !== 'object') {
      throw new Error('Required options must be an object')
    }

    const {
      clientId,
      key,
      engine,
      cookiesFallback
    } = opts

    if (typeof clientId !== 'string' || !clientId.length) {
      throw new Error('Invalid clientId provided')
    }

    if (typeof key !== 'string' || !key.length) {
      throw new Error('Invalid key provided')
    }

    if (typeof engine !== 'string') {
      throw new Error('Storage engine must be provided, either local or session')
    }

    const storage = createStorage(engine)
    const storageKey = `${clientId}.${key}`

    const exists = storage.getItem(storageKey) !== null

    if (!exists && cookiesFallback) {
      return !!getCookie(storageKey)
    }

    return exists
  }

  /**
   * get data from storage
   * @returns {any}
   **/
  static get(opts) {

    if (typeof opts !== 'object') {
      throw new Error('Required options must be an object')
    }

    const {
      clientId,
      key,
      engine,
      cookiesFallback
    } = opts

    if (typeof clientId !== 'string' || !clientId.length) {
      throw new Error('Invalid clientId provided')
    }

    if (typeof key !== 'string' || !key.length) {
      throw new Error('Invalid key provided')
    }

    if (typeof engine !== 'string') {
      throw new Error('Storage engine must be provided, either local or session')
    }

    const storage = createStorage(engine)
    const storageKey = `${clientId}.${key}`

    const item = storage.getItem(storageKey)

    if (!item && cookiesFallback) {
      return getCookie(storageKey)
    }

    return item
  }
}


const createStorage = engine => {
  if (engine === 'memory') {
    // Simple use a memory store
    return memoryStore()
  }

  if (typeof document !== 'undefined') {
    // Web
    if (typeof localStorage === "undefined" || localStorage === null) {
      // Very old browser?
      return memoryStore()
    }

    if (engine === 'session') {
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
