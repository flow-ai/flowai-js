"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventAttachment = _interopRequireDefault(require("./event-attachment"));

var _fileAttachment = _interopRequireDefault(require("./file-attachment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Base class to all attachments
 * @private
 **/
var AttachmentFactory =
/*#__PURE__*/
function () {
  function AttachmentFactory() {
    _classCallCheck(this, AttachmentFactory);
  }

  _createClass(AttachmentFactory, null, [{
    key: "build",

    /**
     * Factory method
     * @private
     **/
    value: function build(_ref) {
      var type = _ref.type,
          payload = _ref.payload;

      switch (type) {
        case 'event':
          return new _eventAttachment.default(payload.name, payload.label);

        default:
          return new Attachment(type, payload);
      }
    }
  }]);

  return AttachmentFactory;
}();

var _default = AttachmentFactory;
exports.default = _default;