"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _exception = _interopRequireDefault(require("./exception"));

var _attachment = _interopRequireDefault(require("./attachment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Trigger flow as opening events
 * @class
 * @example
 * // Opening event without any label
 * const message = new Message({
 *   attachment: new OpeningFlowAttachment(flowImmutableId)
 * })
 *
 **/
var OpeningFlowAttachment =
/*#__PURE__*/
function (_Attachment) {
  _inherits(OpeningFlowAttachment, _Attachment);

  /**
   * Constructor
   * @param {string} flowImmutableId - FlowImmutableId of the flow to trigger
   * @param {string} [label] - Optional human readable label for the triggered event
   **/
  function OpeningFlowAttachment(flowImmutableId, label) {
    _classCallCheck(this, OpeningFlowAttachment);

    if (!label && typeof flowImmutableId !== 'string') {
      throw new _exception.default("OpeningFlowAttachment payload should be a string", 'user');
    }

    if (typeof flowImmutableId !== 'string') {
      throw new _exception.default("OpeningFlowAttachment flow Immutable Id should be a string", 'user');
    }

    if (label && typeof label !== 'string') {
      throw new _exception.default("OpeningFlowAttachment label should be a string", 'user');
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(OpeningFlowAttachment).call(this, 'flow', {
      flowImmutableId: flowImmutableId,
      label: label,
      eventType: 'OPENING'
    }));
  }

  return OpeningFlowAttachment;
}(_attachment.default);

var _default = OpeningFlowAttachment;
exports.default = _default;