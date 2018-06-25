import Exception from './exception'

/**
 * Base class to all attachments
 * @private
 **/
class Attachment {

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
}

export default Attachment
