import debug from 'debug'
import Exception from './exception'

debug('flowai:metadata')
/**
 * Additional Message data
 * @class
 **/
class Metadata {

  /**
   * Constructor
   **/
  constructor({ contexts, params }) {
    this.contexts = contexts || []
    this.params = params || {}

    if(document && location && navigator) {
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
    } else {
      this.domain = {
        realm: 'server'
      }
    }
  }


  /***
   * Add a context
   **/
  addContext(context) {
    if(typeof(context) !== 'string') {
      throw new Exception(`Context must be a string not ${context}`, 'user')
    }

    this.contexts.push(context)
  }

  /***
   * Add a variable with a key and value
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

  static build(metadata){
    return new Metadata({
      contexts: metadata.contexts,
      params: metadata.params,
      domain: metadata.domain
    })
  }
}

export default Metadata
