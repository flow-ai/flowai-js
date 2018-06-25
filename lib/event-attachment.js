'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _attachment = require('./attachment');

var _attachment2 = _interopRequireDefault(_attachment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Trigger events
 * @class
 * @example
 * // Event without any label
 * const message = new Message({
 *   attachment: new EventAttachment('BUY')
 * })
 *
 * @example
 * // Event with label to display user
 * const message = new Message({
 *   attachment: new EventAttachment('BUY', 'Buy dress')
 * })
 **/
var EventAttachment = function (_Attachment) {
  _inherits(EventAttachment, _Attachment);

  /**
   * Constructor
   * @param {string} name - Name of the event to trigger
   * @param {string} [label] - Optional human readable label for the triggered event
   **/
  function EventAttachment(name, label) {
    _classCallCheck(this, EventAttachment);

    if (!label && typeof name !== 'string') {
      throw new _exception2.default("EventAttachment payload should be a string", 'user');
    }

    if (typeof name !== 'string') {
      throw new _exception2.default("EventAttachment event name should be a string", 'user');
    }

    if (label && typeof label !== 'string') {
      throw new _exception2.default("EventAttachment event label should be a string", 'user');
    }

    return _possibleConstructorReturn(this, (EventAttachment.__proto__ || Object.getPrototypeOf(EventAttachment)).call(this, 'event', {
      name: name,
      label: label
    }));
  }

  return EventAttachment;
}(_attachment2.default);

exports.default = EventAttachment;