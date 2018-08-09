import debug from 'debug'
import Originator from './originator'

debug('flowai:reply')

/**
 * Reply being returned by Flow.ai
 * @class
 * @property {string} threadId - Unique id specific to this chat
 * @property {Originator} originator - Originator
 * @property {ReplyMessage[]} messages - List of messages
 * @property {string} messages[].fallback - Textual representation of any responses
 * @property {?string} messages[].replyTo - Optional replying to query
 * @property {?array} messages[].contexts - Optional List of context names
 * @property {?array} messages[].params - Optional key value pair of parameters
 * @property {?array} messages[].intents - Optional list of intent names determined
 * @property {Response[]} messages[].responses - List of response templates
 * @property {string} messages[].responses[].type - Template type
 * @property {Object} messages[].responses[].payload - Template payload
 * @property {Number} messages[].responses[].delay - Number of seconds the response is delayed
 **/
class Reply {

  /**
   * Constructor
   **/
  constructor({ threadId, originator, messages }) {
    this.threadId = threadId
    this.originator = new Originator(originator)
    this.messages = messages.map(message => new ReplyMessage(message))
  }
}

class ReplyMessage {
  constructor({ fallback, replyTo, responses, contexts, params, intents, createdAt }) {
    this.fallback = fallback
    this.replyTo = replyTo || null
    this.responses = responses.map(response => new Response(response))
    this.contexts = contexts || []
    this.params = params || {}
    this.intents = intents || []
    this.createdAt = createdAt || undefined
  }
}

class Response {
  constructor({ type, payload, delay }) {
    this.type = type
    this.payload = payload
    this.delay = delay || 0
  }
}

export default Reply
