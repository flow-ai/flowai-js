import debug from 'debug'
import Originator from './originator'

debug('flowai:reply')

/**
 * Reply being returned by Flow.ai
 * @class
 * @property {string} threadId - Unique id specific to this chat
 * @property {Originator} originator - Originator
 * @property {Array} messages - List of messages
 * @property {string} messages[].fallback - Textual representation of any responses
 * @property {?string} messages[].replyTo - Optional replying to query
 * @property {?array} messages[].contexts - Optional List of context names
 * @property {?array} messages[].params - Optional key value pair of parameters
 * @property {?array} messages[].intents - Optional list of intent names determined
 * @property {Array} messages[].responses - List of response templates
 * @property {Array} messages[].responses[].type - Template type
 * @property {Array} messages[].responses[].payload - Template payload
 * @property {Array} messages[].responses[].delay - Number of seconds the response is delayed
 **/
class Reply {

  /**
   * Constructor
   **/
  constructor({ threadId, originator, messages }) {
    this.threadId = threadId
    this.originator = new Originator(originator)
    this.messages = messages.map((message) => new ReplyMessage(message))
  }
}

class ReplyMessage {
  constructor({ fallback, replyTo, responses, contexts, params, intents }) {
    this.fallback = fallback
    this.replyTo = replyTo || null
    this.responses = responses.map((response) => new Response(response))
    this.contexts = contexts || []
    this.params = params || {}
    this.intents = intents || []
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
