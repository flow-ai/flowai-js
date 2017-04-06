import debug from 'debug'
import Exception from './exception'
import Originator from './originator'
import Metadata  from './metadata'

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
  constructor({threadId, traceId, speech, originator, metadata}) {

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
    this.metadata = metadata || new Metadata({})
  }

  /**
   * Factory method
   **/
  static build(message){
    return new Message({
      speech: message.speech,
      originator: new Originator(message.originator),
      metadata: Metadata.build(message.metadata)
    })
  }
}

export default Message
