'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _originator = require('./originator');

var _originator2 = _interopRequireDefault(_originator);

var _metadata = require('./metadata');

var _metadata2 = _interopRequireDefault(_metadata);

var _attachment = require('./attachment/attachment');

var _attachment2 = _interopRequireDefault(_attachment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(0, _debug2.default)('flowai:message');

/**
 * Message being send to Flow.ai
 * @class
 * @property {string} speech - Text representing the Message
 * @property {Originator} sender - Originator
 * @property {object} meta - Meta data
 **/

var Message = function () {

  /**
   * Constructor
   * @param {int} options.traceId - Optional unique integer you can match messages with
   * @param {string} options.threadId - Optional unique id specific to this chat
   * @param {string} options.speech - Text representing the Message
   * @param {Originator} options.originator - Originator
   * @param {object} options.metadata - Meta data
   **/
  function Message() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Message);

    var threadId = opts.threadId,
        traceId = opts.traceId,
        speech = opts.speech,
        originator = opts.originator,
        metadata = opts.metadata;


    if (traceId && typeof traceId !== 'number') {
      throw new _exception2.default("traceId should be an integer.", 'user');
    }

    if (threadId && typeof threadId !== 'string') {
      throw new _exception2.default("threadId should be an string.", 'user');
    }

    this.threadId = threadId;
    this.traceId = traceId || undefined;
    this.speech = speech || "";
    this.originator = originator || new _originator2.default({});
    this.attachment = null;
    this.metadata = metadata || new _metadata2.default({});
  }

  /**
   * Factory method
   **/


  _createClass(Message, null, [{
    key: 'build',
    value: function build(_ref) {
      var speech = _ref.speech,
          originator = _ref.originator,
          metadata = _ref.metadata,
          attachment = _ref.attachment;

      return new Message({
        speech: speech,
        originator: new _originator2.default(originator),
        metadata: _metadata2.default.build(metadata),
        attachment: _attachment2.default.build(attachment)
      });
    }
  }]);

  return Message;
}();

exports.default = Message;