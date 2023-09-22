"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _debug = _interopRequireDefault(require("debug"));
var _originator = _interopRequireDefault(require("./originator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
(0, _debug.default)('flowai:reply');

/**
 * Reply you receive from Flow.ai
 * @class
 * @property {string} threadId - Unique id specific to this chat
 * @property {Originator} originator - Originator
 * @property {ReplyMessage[]} messages - List of messages
 * @property {string} messages[].fallback - Textual representation of any responses
 * @property {?string} messages[].replyTo - Optional replying to query
 * @property {?array} messages[].contexts - Optional List of context names
 * @property {?array} messages[].params - Optional key value pair of parameters
 * @property {?array} messages[].intents - Optional list of intent names determined
 * @property {Response[]} messages[].responses - List of response templates
 * @property {string} messages[].responses[].type - Template type
 * @property {Object} messages[].responses[].payload - Template payload
 * @property {Number} messages[].responses[].delay - Number of seconds the response is delayed
 **/
var Reply = /*#__PURE__*/_createClass(
/**
 * Constructor
 **/
function Reply(_ref) {
  var threadId = _ref.threadId,
    originator = _ref.originator,
    messages = _ref.messages;
  _classCallCheck(this, Reply);
  this.threadId = threadId;
  this.originator = new _originator.default(originator);
  this.messages = messages.map(function (message) {
    return new ReplyMessage(message);
  });
});
var ReplyMessage = /*#__PURE__*/_createClass(function ReplyMessage(_ref2) {
  var fallback = _ref2.fallback,
    replyTo = _ref2.replyTo,
    responses = _ref2.responses,
    contexts = _ref2.contexts,
    params = _ref2.params,
    intents = _ref2.intents,
    createdAt = _ref2.createdAt;
  _classCallCheck(this, ReplyMessage);
  this.fallback = fallback;
  this.replyTo = replyTo || null;
  this.responses = responses.map(function (response) {
    return new Response(response);
  });
  this.contexts = contexts || [];
  this.params = params || {};
  this.intents = intents || [];
  this.createdAt = createdAt || undefined;
});
var Response = /*#__PURE__*/_createClass(function Response(_ref3) {
  var type = _ref3.type,
    payload = _ref3.payload,
    delay = _ref3.delay;
  _classCallCheck(this, Response);
  this.type = type;
  this.payload = payload;
  this.delay = delay || 0;
});
var _default = Reply;
exports.default = _default;