"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/**
 * Exception
 * @class
 * @property {string} message - Human friendly message
 * @property {string} type - Kind of error
 * @property {Exception} innerException - Inner exception
 * @property {boolean} isFinal - Prevent further execution
 **/
var Exception = /*#__PURE__*/_createClass(
/**
 * Constructor
 * @param {string} message - message - Human friendly message
 * @param {string} type - Kind of error
 * @param {Exception} innerException - Optional inner exception
 * @param {boolean} isFinal - Indicates if this exception prevents further execution
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
});
var _default = Exception;
exports.default = _default;