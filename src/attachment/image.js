import debug from 'debug'
import Attachment from './attachment'
import Exception from '../exception'

debug('flowai:attachment')

/**
 * Image attachment
 * @class
 **/
export default class ImageAttachment extends Attachment {

  /**
   * Constructor
   **/
  constructor(payload) {

    if(typeof payload !== 'File') {
      throw new Exception("payload should be a File object", 'user')
    }

    super('IMAGE', { file: payload })
  }
}
