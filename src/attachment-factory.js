import EventAttachment from './event-attachment'
import FileAttachment from './file-attachment'

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
      default:
        return new Attachment(type, payload)
    }
  }
}

export default AttachmentFactory
