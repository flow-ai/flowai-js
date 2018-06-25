import debug from 'debug'
import Exception from './exception'

debug('flowai:metadata')
/**
 * Additional Message data
 * @class
 * @property {?string} [language] - Language the message is ib
 * @property {?number} [timezone] - UTC time offset in hours
 * @property {?Object} [params] - Parameters to send with the message
 * @property {Object} domain - Browser or server environment variables like origin
 **/
class Metadata {

  /**
   * Constructor
   * @param {?string} [language] - Specify the language of the message
   * @param {?number} [timezone] - Specify the timezone of the message
   * @param {?Object} [params] - Additional data to be send 
   **/
  constructor({ contexts, params, language, timezone }) {
    this.language = language || undefined
    this.timezone = timezone || -(new Date().getTimezoneOffset() / 60)
    this.contexts = contexts || []
    this.params = params || {}

    if(!global.navigator ||
       !global.document ||
       !global.location) {

      this.domain = {
        realm: 'server'
      }
    } else {
      // This is a web browser
      let origin
      if (typeof location.origin === 'undefined') {
        location.origin = location.protocol + '//' + location.host
      } else {
        origin = location.origin
      }

      const {
        href,
        pathname,
        hostname
      } = location

      this.domain = {
        realm: 'browser',
        title: document.title,
        url: href,
        pathname: pathname,
        origin,
        hostname: hostname,
        language: navigator.language,
        platform: navigator.platform
      }

      if(!this.language) {
        this.language = navigator.language
      }
    }
  }

  /***
   * Add a variable with a key and value
   * @param {string} key - Name of the param
   * @param {string} value - List of values
   * @example
   * metadata.addParam('shopId', '1234')
   **/
  addParam(key, value) {
    if(typeof(key) !== 'string') {
      throw new Exception(`The key must be string not ${key}`, 'user')
    }

    if(typeof(value) === undefined) {
      throw new Exception(`value must be present or null`, 'user')
    }

    this.params[key] = value
  }

  /**
   * @deprecated
   **/
  addContext(context) {
    if(typeof(context) !== 'string') {
      throw new Exception(`Context must be a string not ${context}`, 'user')
    }

    this.contexts.push(context)
  }

  static build(metadata){
    return new Metadata({
      language: metadata.language || undefined,
      timezone: metadata.timezone || undefined,
      contexts: metadata.contexts,
      params: metadata.params,
      domain: metadata.domain
    })
  }
}

export default Metadata
