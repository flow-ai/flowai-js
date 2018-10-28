import debug from 'debug'
import Exception from './exception'
import Originator from './originator'
import Metadata  from './metadata'
import Attachment from './attachment'
import AttachmentFactory from './attachment-factory'

debug('flowai:message')

/**
 * Message you send to Flow.ai
 * @class
 * @property {string} speech - Text representing the Message
 * @property {Originator} originator - Originator
 * @property {Metadata} meta - Meta data
 * @property {Attachment} attachment - Optional attachment
 **/
class Message {

  /**
   * Constructor
   * @constructor
   * @param {?Object} opts
   * @param {?number} opts.traceId - Optional unique integer you can match messages with
   * @param {string} opts.threadId - Optional unique id specific to this chat
   * @param {string} opts.speech - Text representing the Message
   * @param {Originator} opts.originator - Originator
   * @param {?Metadata} opts.metadata - Meta data
   * @param {?Attachment} opts.attachment - Attachment (optional)
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
      throw new Exception("threadId should be a string.", 'user')
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
   * @param {object} opts
   * @param {string} opts.threadId
   * @param {string} opts.traceId
   * @param {string} opts.speech
   * @param {object} opts.originator
   * @param {object} opts.metadata
   * @param {object} opts.attachment
   * @returns {Message}
   **/
  static build({ threadId, traceId, speech, originator, metadata, attachment }){
    debug('Calling build', threadId, traceId, speech, originator, metadata, attachment)
    return new Message({
      threadId,
      traceId,
      speech,
      originator: new Originator(originator),
      metadata: Metadata.build(metadata),
      attachment: (attachment) ? AttachmentFactory.build(attachment) : undefined
    })
  }
}

export default Message
