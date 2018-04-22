'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Exception
 * @class
 * @property {string} message - Human friendly message
 * @property {string} type - Kind of error
 * @property {Exception} innerException - Inner exception
 **/
var Exception =

/**
 * Constructor
 * @param {string} message - message - Human friendly message
 * @param {string} type - Kind of error
 * @param {Exception} innerException - Optional inner exception
 * @param {bool} isFinal - Indicates if this exception prevents further execution
 **/
function Exception(message, type, innerException) {
  var isFinal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  _classCallCheck(this, Exception);

  if (!message) {
    throw new Error('Message is mandatory to create a new Exception');
  }

  if (message && message instanceof Error) {
    var err = message;
    this.message = err.message || "Unknown error";
  } else if (typeof message === 'string') {
    this.message = message;
  } else if (message instanceof Exception) {
    return message;
  } else {
    this.message = "Unknown error";
  }

  this.innerException = innerException || null;
  this.type = type || "Generic exception";
  this.isFinal = isFinal;
};

exports.default = Exception;