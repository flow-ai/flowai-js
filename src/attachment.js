import debug from 'debug'
import Exception from './exception'

debug('flowai:attachment')

/**
 * Base class to all attachments
 * @class
 **/
export class Attachment {

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

  static build({ type, payload}) {
    switch(type) {
      case 'event':
        return new EventAttachment(payload.name)
      default:
        return new Attachment(type, payload)
    }
  }
}

/**
 * Trigger events
 * @class
 *
 * @example
 * const message = new Message({
 *    attachment: new EventAttachment('BUY')
 * })
 **/
export class EventAttachment extends Attachment {

  /**
   * Constructor
   **/
  constructor(payload) {

    if(typeof payload !== 'string') {
      throw new Exception("EventAttachment payload should be a string", 'user')
    }

    super('event', { name: payload })
  }
}
