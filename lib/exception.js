"use strict";

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
 **/
function Exception(message, type, innerException) {
  _classCallCheck(this, Exception);

  if (message instanceof Error) {
    var err = message;
    this.message = err.message || "Unknown error";
    this.type = type || "Generic exception";
    this.innerException = err || null;
  } else if (message instanceof Exception) {
    return message;
  } else if (typeof message !== 'string') {
    throw new Error('Empty error message for Exception');
  } else {
    this.message = message || "Unknown error";
    this.type = type || "Generic exception";
    this.innerException = innerException || null;
  }
};

exports.default = Exception;