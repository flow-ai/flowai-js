import debug from 'debug'
import Exception from '../exception'

debug('flowai:attachment')

/**
 * Base class to all attachments
 * @class
 **/
export default class Attachment {

  /**
   * Constructor
   **/
  constructor(type, payload) {

    if(typeof type !== 'string') {
      throw new Exception("type should be a string.", 'user')
    }

    if(typeof payload !== 'object') {
      throw new Exception("payload should be an object.", 'user')
    }

    this.type = type
    this.payload = payload
  }

  build({ type, payload}) {
    return new Attachment(type, payload)
  }
}
