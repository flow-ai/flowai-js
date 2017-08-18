import debug from 'debug'
import Attachment from './attachment'
import Exception from '../exception'

debug('flowai:attachment')

/**
 * Event attachment
 * @class
 **/
export default class EventAttachment extends Attachment {

  /**
   * Constructor
   **/
  constructor(payload) {

    if(typeof payload !== 'string') {
      throw new Exception("payload should be a string", 'user')
    }

    super('EVENT', { name: payload })
  }
}
