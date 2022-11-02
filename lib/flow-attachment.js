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
 * Trigger flows
 * @class
 * @example
 * const message = new Message({
 *   attachment: new FlowAttachment(flowImmutableId)
 * })
 *
 **/
var FlowAttachment =
/*#__PURE__*/
function (_Attachment) {
  _inherits(FlowAttachment, _Attachment);

  /**
   * Constructor
   * @param {string} flowImmutableId - Immutable flowId of the flow to trigger
   **/
  function FlowAttachment(flowImmutableId) {
    _classCallCheck(this, FlowAttachment);

    if (typeof flowImmutableId !== 'string') {
      throw new _exception.default("FlowAttachment payload should be a string", 'user');
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(FlowAttachment).call(this, 'flow', {
      flowImmutableId: flowImmutableId
    }));
  }

  return FlowAttachment;
}(_attachment.default);

var _default = FlowAttachment;
exports.default = _default;