"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _debug = _interopRequireDefault(require("debug"));
var _exception = _interopRequireDefault(require("./exception"));
var _originator = _interopRequireDefault(require("./originator"));
var _metadata = _interopRequireDefault(require("./metadata"));
var _attachment = _interopRequireDefault(require("./attachment"));
var _attachmentFactory = _interopRequireDefault(require("./attachment-factory"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
(0, _debug.default)('flowai:message');

/**
 * Message you send to Flow.ai
 * @class
 * @property {string} speech - Text representing the Message
 * @property {Originator} originator - Originator
 * @property {Metadata} meta - Meta data
 * @property {Attachment} attachment - Optional attachment
 **/
var Message = /*#__PURE__*/function () {
  /**
   * Constructor
   * @constructor
   * @param {?Object} opts
   * @param {?number} opts.traceId - Optional unique integer you can match messages with
   * @param {string} opts.threadId - Optional unique id specific to this chat
   * @param {string} opts.speech - Text representing the Message
   * @param {Originator} opts.originator - Originator
   * @param {?Metadata} opts.metadata - Meta data
   * @param {?Attachment} opts.attachment - Attachment (optional)
   **/
  function Message() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Message);
    var threadId = opts.threadId,
      traceId = opts.traceId,
      speech = opts.speech,
      originator = opts.originator,
      metadata = opts.metadata,
      attachment = opts.attachment;
    if (traceId && typeof traceId !== 'number') {
      throw new _exception.default("traceId should be an integer.", 'user');
    }
    if (threadId && typeof threadId !== 'string') {
      throw new _exception.default("threadId should be a string.", 'user');
    }
    if (attachment && !(attachment instanceof _attachment.default)) {
      throw new _exception.default("attachment should be a Attachment.", 'user');
    }
    this.threadId = threadId;
    this.traceId = traceId || undefined;
    this.speech = speech || "";
    this.originator = originator || new _originator.default({});
    this.metadata = metadata || new _metadata.default({});
    this.attachment = attachment || undefined;
    if (!this.speech.length && attachment) {
      this.speech = "".concat(attachment.type, " attachment");
    }
  }

  /**
   * Factory method
   * @param {object} opts
   * @param {string} opts.threadId
   * @param {string} opts.traceId
   * @param {string} opts.speech
   * @param {object} opts.originator
   * @param {object} opts.metadata
   * @param {object} opts.attachment
   * @returns {Message}
   **/
  _createClass(Message, null, [{
    key: "build",
    value: function build(_ref) {
      var threadId = _ref.threadId,
        traceId = _ref.traceId,
        speech = _ref.speech,
        originator = _ref.originator,
        metadata = _ref.metadata,
        attachment = _ref.attachment;
      (0, _debug.default)('Calling build', threadId, traceId, speech, originator, metadata, attachment);
      return new Message({
        threadId: threadId,
        traceId: traceId,
        speech: speech,
        originator: new _originator.default(originator),
        metadata: _metadata.default.build(metadata),
        attachment: attachment ? _attachmentFactory.default.build(attachment) : undefined
      });
    }
  }]);
  return Message;
}();
var _default = Message;
exports.default = _default;