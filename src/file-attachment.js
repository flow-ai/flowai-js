import FormData from 'form-data'
import Attachment from './attachment'

/**
 * Send a file as attachment
 * @class
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
class FileAttachment extends Attachment {
   /**
    * Constructor
    * @param {File|ReadStream} data - File or Blob in the browser, ReadStream in Nodejs
    **/
  constructor(data) {

    const formData = new FormData()
    formData.append('file', data)

    super('file', {
      formData
    })
  }
}

export default FileAttachment
