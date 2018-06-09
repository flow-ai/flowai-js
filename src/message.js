import debug from 'debug'
import Exception from './exception'
import Originator from './originator'
import Metadata  from './metadata'
import { Attachment } from './attachment'

debug('flowai:message')

/**
 * Message being send to Flow.ai
 * @class
 * @property {string} speech - Text representing the Message
 * @property {Originator} originator - Originator
 * @property {?Metadata} meta - Meta data
 * @property {?Attachment} attachment - Optional attachment
 **/
class Message {

  /**
   * Constructor
   * @param {?int} options.traceId - Optional unique integer you can match messages with
   * @param {string} options.threadId - Optional unique id specific to this chat
   * @param {string} options.speech - Text representing the Message
   * @param {Originator} options.originator - Originator
   * @param {?Metadata} options.metadata - Meta data
   * @param {?Attachment} options.attachment - Attachment (optional)
   **/
  constructor(opts = {}) {

    const {
      threadId,
      traceId,
      speech,
      originator,
      metadata,
      attachment
    } = opts

    if(traceId && typeof traceId !== 'number') {
      throw new Exception("traceId should be an integer.", 'user')
    }

    if(threadId && typeof threadId !== 'string') {
      throw new Exception("threadId should be an string.", 'user')
    }

    if(attachment && !(attachment instanceof Attachment) ) {
      throw new Exception("attachment should be a Attachment.", 'user')
    }

    this.threadId = threadId
    this.traceId = traceId || undefined
    this.speech = speech || ""
    this.originator = originator || new Originator({})
    this.metadata = metadata || new Metadata({})
    this.attachment = attachment || undefined

    if(!this.speech.length && attachment) {
      this.speech = `${attachment.type} attachment`
    }
  }

  /**
   * Factory method
   **/
  static build({ speech, originator, metadata, attachment }){
    return new Message({
      speech,
      originator: new Originator(originator),
      metadata: Metadata.build(metadata),
      attachment: (attachment) ? Attachment.build(attachment) : undefined
    })
  }
}

export default Message
