import Exception from './exception'
import Attachment from './attachment'
import EventTypes from './eventTypes'

/**
 * Trigger opening events
 * @class
 * @example
 * // Opening event without any label
 * const message = new Message({
 *   attachment: new OpeningAttachment('BUY')
 * })
 *
 * @example
 * // Opening event with label to display user
 * const message = new Message({
 *   attachment: new OpeningAttachment('BUY', 'Buy dress')
 * })
 **/
class OpeningAttachment extends Attachment {

  /**
   * Constructor
   * @param {string} name - Name of the event to trigger
   * @param {string} [label] - Optional human readable label for the triggered event
   **/
  constructor(name, label) {

    if(!label && typeof name !== 'string') {
      throw new Exception("EventAttachment payload should be a string", 'user')
    }

    if(typeof name !== 'string') {
      throw new Exception("EventAttachment event name should be a string", 'user')
    }

    if(label && typeof label !== 'string') {
      throw new Exception("EventAttachment event label should be a string", 'user')
    }

    super('event', {
      name,
      label,
      eventType: EventTypes.OPENING_EVENT_TYPE
    })
  }
}

export default OpeningAttachment
