import Exception from './exception'
import Attachment from './attachment'

/**
 * Trigger flow as opening events
 * @class
 * @example
 * // Opening event without any label
 * const message = new Message({
 *   attachment: new OpeningFlowAttachment(flowImmutableId)
 * })
 *
 **/
class OpeningFlowAttachment extends Attachment {

  /**
   * Constructor
   * @param {string} flowImmutableId - FlowImmutableId of the flow to trigger
   * @param {string} [label] - Optional human readable label for the triggered event
   **/
  constructor(flowImmutableId, label) {
    if(!label && typeof flowImmutableId !== 'string') {
      throw new Exception("OpeningFlowAttachment payload should be a string", 'user')
    }

    if(typeof flowImmutableId !== 'string') {
      throw new Exception("OpeningFlowAttachment flow Immutable Id should be a string", 'user')
    }

    if(label && typeof label !== 'string') {
      throw new Exception("OpeningFlowAttachment label should be a string", 'user')
    }

    super('flow', {
      flowImmutableId,
      label,
      eventType: 'OPENING'
    })
  }
}

export default OpeningFlowAttachment
