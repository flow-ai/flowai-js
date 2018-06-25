'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    throw new _exception2.default("type should be a string.", 'user');
  }

  if ((typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) !== 'object') {
    throw new _exception2.default("payload should be an object.", 'user');
  }

  this.type = type;
  this.payload = payload;
};

exports.default = Attachment;