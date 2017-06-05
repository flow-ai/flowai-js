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
 **/

var Metadata = function () {

  /**
   * Constructor
   **/
  function Metadata(_ref) {
    var contexts = _ref.contexts,
        params = _ref.params;

    _classCallCheck(this, Metadata);

    this.contexts = contexts || [];
    this.params = params || {};

    if (document && location && navigator) {
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
    } else {
      this.domain = {
        realm: 'server'
      };
    }
  }

  /***
   * Add a context
   **/


  _createClass(Metadata, [{
    key: 'addContext',
    value: function addContext(context) {
      if (typeof context !== 'string') {
        throw new _exception2.default('Context must be a string not ' + context, 'user');
      }

      this.contexts.push(context);
    }

    /***
     * Add a variable with a key and value
     **/

  }, {
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
  }], [{
    key: 'build',
    value: function build(metadata) {
      return new Metadata({
        contexts: metadata.contexts,
        params: metadata.params,
        domain: metadata.domain
      });
    }
  }]);

  return Metadata;
}();

exports.default = Metadata;