import EventAttachment from './event-attachment'
import FileAttachment from './file-attachment'
import FlowAttachment from './flow-attachment'
import Attachment from './attachment'
/**
 * Base class to all attachments
 * @private
 **/
class AttachmentFactory {
  /**
   * Factory method
   * @private
   **/
  static build({ type, payload}) {
    switch(type) {
      case 'event':
        return new EventAttachment(payload.name, payload.label)
      case 'flow':
        return new FlowAttachment(payload.flowImmutableId)
      default:
        return new Attachment(type, payload)
    }
  }
}

export default AttachmentFactory
