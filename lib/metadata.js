'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(0, _debug2.default)('flowai:metadata');
/**
 * Additional Message data
 * @class
 * @property {?string} [language] - Language the message is ib
 * @property {?number} [timezone] - UTC time offset in hours
 * @property {?Object} [params] - Parameters to send with the message
 * @property {Object} domain - Browser or server environment variables like origin
 **/

var Metadata = function () {

  /**
   * Constructor
   * @param {?string} [language] - Specify the language of the message
   * @param {?number} [timezone] - Specify the timezone of the message
   * @param {?Object} [params] - Additional data to be send 
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
      var origin = void 0;
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
   * @param {string} key - Name of the param
   * @param {string} value - List of values
   * @example
   * metadata.addParam('shopId', '1234')
   **/


  _createClass(Metadata, [{
    key: 'addParam',
    value: function addParam(key, value) {
      if (typeof key !== 'string') {
        throw new _exception2.default('The key must be string not ' + key, 'user');
      }

      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === undefined) {
        throw new _exception2.default('value must be present or null', 'user');
      }

      this.params[key] = value;
    }

    /**
     * @deprecated
     **/

  }, {
    key: 'addContext',
    value: function addContext(context) {
      if (typeof context !== 'string') {
        throw new _exception2.default('Context must be a string not ' + context, 'user');
      }

      this.contexts.push(context);
    }
  }], [{
    key: 'build',
    value: function build(metadata) {
      return new Metadata({
        language: metadata.language || undefined,
        timezone: metadata.timezone || undefined,
        contexts: metadata.contexts,
        params: metadata.params,
        domain: metadata.domain
      });
    }
  }]);

  return Metadata;
}();

exports.default = Metadata;