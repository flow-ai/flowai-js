import debug from 'debug'
import Exception from './exception'
import FormData from 'form-data'

debug('flowai:attachment')

/**
 * Base class to all attachments
 * @class
 **/
export class Attachment {

  /**
   * Constructor
   **/
  constructor(type, payload) {

    if(typeof type !== 'string') {
      throw new Exception("type should be a string.", 'user')
    }

    if(typeof payload !== 'object') {
      throw new Exception("payload should be an object.", 'user')
    }

    this.type = type
    this.payload = payload
  }

  static build({ type, payload}) {
    switch(type) {
      case 'event':
        return new EventAttachment(payload.name)
      default:
        return new Attachment(type, payload)
    }
  }
}

/**
 * Send a file as attachment
 * @param {File|ReadStream} data - File or Blob in the browser, ReadStream in Nodejs
 *
 * @example
 * // Web example
 *
 * var originator = new Originator({
 *   name: 'Jane'
 * })
 *
 * var file = fileInputElement.files[0]
 *
 * const message = new Message({
 *   attachment: new FileAttachment(file)
 * })
 *
 * client.send(message)
 *
 * @example
 * // Nodejs example
 * import { createReadStream } from 'fs'
 *
 * const originator = new Originator({
 *   name: 'Jane'
 * })
 *
 * // Load ReadStream from file on disk
 * const data = fs.createReadStream('/foo/bar.jpg')
 *
 * const message = new Message({
 *   attachment: new FileAttachment(data)
 * })
 *
 * client.send(message)
 **/
export class FileAttachment extends Attachment {
   /**
    * Constructor
    **/
  constructor(data) {

    const formData = new FormData()
    formData.append('file', data)

    super('file', {
      formData
    })
  }
}

/**
 * Trigger events
 * @class
 *
 * @example
 * const message = new Message({
 *   attachment: new EventAttachment('BUY')
 * })
 **/
export class EventAttachment extends Attachment {

  /**
   * Constructor
   **/
  constructor(payload) {

    if(typeof payload !== 'string') {
      throw new Exception("EventAttachment payload should be a string", 'user')
    }

    super('event', { name: payload })
  }
}
