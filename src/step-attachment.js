import Exception from './exception'
import Attachment from './attachment'

/**
 * Trigger steps
 * @class
 * @example
 * const message = new Message({
 *   attachment: new StepAttachment(stepId)
 * })
 *
 **/
class StepAttachment extends Attachment {

  /**
   * Constructor
   * @param {string} stepId - Immutable stepId of the step to trigger
   **/
  constructor(stepId) {

    if(typeof stepId !== 'string') {
      throw new Exception("StepAttachment payload should be a string", 'user')
    }

    super('step', {
      stepId
    })
  }
}

export default StepAttachment
