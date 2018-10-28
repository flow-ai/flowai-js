"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _exception = _interopRequireDefault(require("./exception"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base class to all attachments
 * @private
 **/
var Attachment =
/**
 * Constructor
 **/
function Attachment(type, payload) {
  _classCallCheck(this, Attachment);

  if (typeof type !== 'string') {
    throw new _exception.default("type should be a string.", 'user');
  }

  if (_typeof(payload) !== 'object') {
    throw new _exception.default("payload should be an object.", 'user');
  }

  this.type = type;
  this.payload = payload;
};

var _default = Attachment;
exports.default = _default;