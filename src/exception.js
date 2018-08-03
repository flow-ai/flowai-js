/**
 * Exception
 * @class
 * @property {string} message - Human friendly message
 * @property {string} type - Kind of error
 * @property {Exception} innerException - Inner exception
 * @property {bool} isFinal - Prevent further execution
 **/
class Exception {

  /**
   * Constructor
   * @param {string} message - message - Human friendly message
   * @param {string} type - Kind of error
   * @param {Exception} innerException - Optional inner exception
   * @param {bool} isFinal - Indicates if this exception prevents further execution
   **/
  constructor(message, type, innerException, isFinal = false) {

    if(!message) {
      throw new Error('Message is mandatory to create a new Exception')
    }

    if(message && message instanceof Error) {
      const err = message
      this.message = err.message || "Unknown error"
    } else if(typeof(message) === 'string') {
      this.message = message
    } else if(message instanceof Exception) {
      return message
    } else {
      this.message = "Unknown error"
    }

    this.innerException = innerException || null
    this.type = type || "Generic exception"
    this.isFinal = isFinal
  }
}

export default Exception
