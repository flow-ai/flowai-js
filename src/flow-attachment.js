import Exception from './exception'
import Attachment from './attachment'

/**
 * Trigger flows
 * @class
 * @example
 * const message = new Message({
 *   attachment: new FlowAttachment(flowImmutableId)
 * })
 *
 **/
class FlowAttachment extends Attachment {

  /**
   * Constructor
   * @param {string} flowImmutableId - Immutable flowId of the flow to trigger
   **/
  constructor(flowImmutableId) {

    if(typeof flowImmutableId !== 'string') {
      throw new Exception("FlowAttachment payload should be a string", 'user')
    }

    super('flow', {
      flowImmutableId
    })
  }
}

export default FlowAttachment
