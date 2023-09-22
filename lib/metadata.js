"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _debug = _interopRequireDefault(require("debug"));

var _exception = _interopRequireDefault(require("./exception"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(0, _debug.default)('flowai:metadata');
/**
 * Additional Message data
 * @class
 * @property {?string} language - Language the message is ib
 * @property {?number} timezone - UTC time offset in hours
 * @property {?Object} params - Parameters to send with the message
 * @property {Object} domain - Browser or server environment variables like origin
 **/

var Metadata =
/*#__PURE__*/
function () {
  /**
   * Constructor
   * @constructor
   * @param {?string} language - Specify the language of the message
   * @param {?number} timezone - Specify the timezone of the message
   * @param {?Object} params - Additional data to be send
   **/
  function Metadata(_ref) {
    var contexts = _ref.contexts,
        params = _ref.params,
        language = _ref.language,
        timezone = _ref.timezone;

    _classCallCheck(this, Metadata);

    this.language = language || undefined;
    this.timezone = timezone || -(new Date().getTimezoneOffset() / 60);
    this.contexts = contexts || [];
    this.params = params || {};

    if (!global.navigator || !global.document || !global.location) {
      this.domain = {
        realm: 'server'
      };
    } else {
      // This is a web browser
      var origin;

      if (typeof location.origin === 'undefined') {
        location.origin = location.protocol + '//' + location.host;
      } else {
        origin = location.origin;
      }

      var _location = location,
          href = _location.href,
          pathname = _location.pathname,
          hostname = _location.hostname;
      this.domain = {
        realm: 'browser',
        title: document.title,
        url: href,
        pathname: pathname,
        origin: origin,
        hostname: hostname,
        language: navigator.language,
        platform: navigator.platform
      };

      if (!this.language) {
        this.language = navigator.language;
      }
    }
  }
  /***
   * Add a variable with a key and value
   * @method
   * @param {string} key - Name of the param
   * @param {string} value - List of values
   * @example
   * metadata.addParam('shopId', '1234')
   **/


  _createClass(Metadata, [{
    key: "addParam",
    value: function addParam(key, value) {
      if (typeof key !== 'string') {
        throw new _exception.default("The key must be string not ".concat(key), 'user');
      }

      if (_typeof(value) === undefined) {
        throw new _exception.default("value must be present or null", 'user');
      }

      this.params[key] = value;
    }
    /**
     * @method
     * @deprecated
     **/

  }, {
    key: "addContext",
    value: function addContext(context) {
      if (typeof context !== 'string') {
        throw new _exception.default("Context must be a string not ".concat(context), 'user');
      }

      this.contexts.push(context);
    }
    /**
     * Create a Metadata object from raw data
     * @static 
     * @param {Object} metadata
     * @returns {Metadata}
     **/

  }], [{
    key: "build",
    value: function build(metadata) {
      return new Metadata(Object.assign({}, metadata, {
        language: metadata.language || undefined,
        timezone: metadata.timezone || undefined,
        contexts: metadata.contexts,
        params: metadata.params,
        domain: metadata.domain
      }));
    }
  }]);

  return Metadata;
}();

var _default = Metadata;
exports.default = _default;