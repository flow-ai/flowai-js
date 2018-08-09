'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _originator = require('./originator');

var _originator2 = _interopRequireDefault(_originator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(0, _debug2.default)('flowai:reply');

/**
 * Reply being returned by Flow.ai
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

var Reply =

/**
 * Constructor
 **/
function Reply(_ref) {
  var threadId = _ref.threadId,
      originator = _ref.originator,
      messages = _ref.messages;

  _classCallCheck(this, Reply);

  this.threadId = threadId;
  this.originator = new _originator2.default(originator);
  this.messages = messages.map(function (message) {
    return new ReplyMessage(message);
  });
};

var ReplyMessage = function ReplyMessage(_ref2) {
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
};

var Response = function Response(_ref3) {
  var type = _ref3.type,
      payload = _ref3.payload,
      delay = _ref3.delay;

  _classCallCheck(this, Response);

  this.type = type;
  this.payload = payload;
  this.delay = delay || 0;
};

exports.default = Reply;