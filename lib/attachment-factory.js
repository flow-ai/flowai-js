"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eventAttachment = _interopRequireDefault(require("./event-attachment"));
var _fileAttachment = _interopRequireDefault(require("./file-attachment"));
var _flowAttachment = _interopRequireDefault(require("./flow-attachment"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Base class to all attachments
 * @private
 **/
var AttachmentFactory = /*#__PURE__*/function () {
  function AttachmentFactory() {
    _classCallCheck(this, AttachmentFactory);
  }
  _createClass(AttachmentFactory, null, [{
    key: "build",
    value:
    /**
     * Factory method
     * @private
     **/
    function build(_ref) {
      var type = _ref.type,
        payload = _ref.payload;
      switch (type) {
        case 'event':
          return new _eventAttachment.default(payload.name, payload.label);
        case 'flow':
          return new _flowAttachment.default(payload.flowImmutableId);
        default:
          return new Attachment(type, payload);
      }
    }
  }]);
  return AttachmentFactory;
}();
var _default = AttachmentFactory;
exports.default = _default;