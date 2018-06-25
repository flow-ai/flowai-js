'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventAttachment = require('./event-attachment');

var _eventAttachment2 = _interopRequireDefault(_eventAttachment);

var _fileAttachment = require('./file-attachment');

var _fileAttachment2 = _interopRequireDefault(_fileAttachment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base class to all attachments
 * @private
 **/
var AttachmentFactory = function () {
  function AttachmentFactory() {
    _classCallCheck(this, AttachmentFactory);
  }

  _createClass(AttachmentFactory, null, [{
    key: 'build',

    /**
     * Factory method
     * @private
     **/
    value: function build(_ref) {
      var type = _ref.type,
          payload = _ref.payload;

      switch (type) {
        case 'event':
          return new _eventAttachment2.default(payload.name, payload.label);
        default:
          return new Attachment(type, payload);
      }
    }
  }]);

  return AttachmentFactory;
}();

exports.default = AttachmentFactory;