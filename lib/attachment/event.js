'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _attachment = require('./attachment');

var _attachment2 = _interopRequireDefault(_attachment);

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _debug2.default)('flowai:attachment');

/**
 * Event attachment
 * @class
 **/

var EventAttachment = function (_Attachment) {
  _inherits(EventAttachment, _Attachment);

  /**
   * Constructor
   **/
  function EventAttachment(payload) {
    _classCallCheck(this, EventAttachment);

    if (typeof payload !== 'string') {
      throw new _exception2.default("payload should be a string", 'user');
    }

    return _possibleConstructorReturn(this, (EventAttachment.__proto__ || Object.getPrototypeOf(EventAttachment)).call(this, 'EVENT', { name: payload }));
  }

  return EventAttachment;
}(_attachment2.default);

exports.default = EventAttachment;