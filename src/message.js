import debug from 'debug'
import Exception from './exception'
import Originator from './originator'
import Metadata  from './metadata'
import Attachment from './attachment/attachment'

debug('flowai:message')

/**
 * Message being send to Flow.ai
 * @class
 * @property {string} speech - Text representing the Message
 * @property {Originator} sender - Originator
 * @property {object} meta - Meta data
 **/
class Message {

  /**
   * Constructor
   * @param {int} options.traceId - Optional unique integer you can match messages with
   * @param {string} options.threadId - Optional unique id specific to this chat
   * @param {string} options.speech - Text representing the Message
   * @param {Originator} options.originator - Originator
   * @param {object} options.metadata - Meta data
   **/
  constructor(opts = {}) {

    const {
      threadId,
      traceId,
      speech,
      originator,
      metadata
    } = opts

    if(traceId && typeof traceId !== 'number') {
      throw new Exception("traceId should be an integer.", 'user')
    }

    if(threadId && typeof threadId !== 'string') {
      throw new Exception("threadId should be an string.", 'user')
    }

    this.threadId = threadId
    this.traceId = traceId || undefined
    this.speech = speech || ""
    this.originator = originator || new Originator({})
    this.attachment = null
    this.metadata = metadata || new Metadata({})
  }

  /**
   * Factory method
   **/
  static build({ speech, originator, metadata, attachment }){
    return new Message({
      speech,
      originator: new Originator(originator),
      metadata: Metadata.build(metadata),
      attachment: Attachment.build(attachment)
    })
  }
}

export default Message
