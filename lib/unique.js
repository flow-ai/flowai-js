"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _debug = _interopRequireDefault(require("debug"));

var _uuidV = _interopRequireDefault(require("uuid-v4"));

var _cookies = require("./cookies");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var reqqq = require;
(0, _debug.default)('flowai:unique');
/**
 * Generates and stores a unique ID
 * @class
 * @private
 **/

var Unique =
/*#__PURE__*/
function () {
  function Unique(opts) {
    _classCallCheck(this, Unique);

    if (_typeof(opts) !== 'object') {
      throw new Error('Required options must be an object');
    }

    var clientId = opts.clientId,
        key = opts.key,
        value = opts.value,
        engine = opts.engine,
        cookiesFallback = opts.cookiesFallback;

    if (typeof clientId !== 'string' || !clientId.length) {
      throw new Error('Invalid clientId provided');
    }

    if (typeof key !== 'string' || key.length < 2) {
      throw new Error('Invalid key provided');
    }

    if (typeof engine !== 'string') {
      throw new Error('Storage engine must be provided, either local or session');
    }

    this._clientId = clientId;
    this._key = key;
    this._storageKey = "".concat(clientId, ".").concat(key);
    this._storage = createStorage(engine);
    this._cookiesFallback = cookiesFallback;
    (0, _debug.default)("Creating a new Unique with key '".concat(key, "' and value '").concat(value, "'"));

    if (value !== null && value !== undefined) {
      this._storage.setItem(this._storageKey, value);

      if (this._cookiesFallback) {
        (0, _cookies.setCookie)(this._storageKey, value);
      }
    }
  }
  /**
   * Get a unique ID that is stored or generate a new one and store it
   * @returns {string}
   **/


  _createClass(Unique, [{
    key: "id",
    value: function id() {
      var uniqueId = this._storage.getItem(this._storageKey);

      if (!uniqueId && this._cookiesFallback) {
        uniqueId = (0, _cookies.getCookie)(this._storageKey);
      }

      if (!uniqueId) {
        // Remove dashes
        uniqueId = (0, _uuidV.default)().replace(/-/g, '');

        if (this._key === 'threadId') {
          var channelId = atob(this._clientId).split('|')[1];
          uniqueId = "".concat(uniqueId, "|").concat(channelId);
        }

        (0, _debug.default)("Creating a new uniqueId '".concat(uniqueId, "'"));

        this._storage.setItem(this._storageKey, uniqueId);
      }

      (0, _debug.default)("Returning uniqueId '".concat(uniqueId, "'"));
      return uniqueId;
    }
    /**
     * See if a key exists in storageKey
     * @returns {boolean}
     **/

  }], [{
    key: "exists",
    value: function exists(opts) {
      if (_typeof(opts) !== 'object') {
        throw new Error('Required options must be an object');
      }

      var clientId = opts.clientId,
          key = opts.key,
          engine = opts.engine,
          cookiesFallback = opts.cookiesFallback;

      if (typeof clientId !== 'string' || !clientId.length) {
        throw new Error('Invalid clientId provided');
      }

      if (typeof key !== 'string' || !key.length) {
        throw new Error('Invalid key provided');
      }

      if (typeof engine !== 'string') {
        throw new Error('Storage engine must be provided, either local or session');
      }

      var storage = createStorage(engine);
      var storageKey = "".concat(clientId, ".").concat(key);
      var exists = storage.getItem(storageKey) !== null;

      if (!exists && cookiesFallback) {
        return !!(0, _cookies.getCookie)(storageKey);
      }

      return exists;
    }
    /**
     * get data from storage
     * @returns {any}
     **/

  }, {
    key: "get",
    value: function get(opts) {
      if (_typeof(opts) !== 'object') {
        throw new Error('Required options must be an object');
      }

      var clientId = opts.clientId,
          key = opts.key,
          engine = opts.engine,
          cookiesFallback = opts.cookiesFallback;

      if (typeof clientId !== 'string' || !clientId.length) {
        throw new Error('Invalid clientId provided');
      }

      if (typeof key !== 'string' || !key.length) {
        throw new Error('Invalid key provided');
      }

      if (typeof engine !== 'string') {
        throw new Error('Storage engine must be provided, either local or session');
      }

      var storage = createStorage(engine);
      var storageKey = "".concat(clientId, ".").concat(key);
      var item = storage.getItem(storageKey);

      if (!item && cookiesFallback) {
        return (0, _cookies.getCookie)(storageKey);
      }

      return item;
    }
  }]);

  return Unique;
}();

var createStorage = function createStorage(engine) {
  if (engine === 'memory') {
    // Simple use a memory store
    return memoryStore();
  }

  if (typeof document !== 'undefined') {
    // Web
    if (typeof localStorage === "undefined" || localStorage === null) {
      // Very old browser?
      return memoryStore();
    }

    if (engine === 'session') {
      // Session store
      return sessionStorage;
    }

    return localStorage;
  } else if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
    // React native
    return memoryStore();
  } else {
    // Nodejs
    var LocalStorage = reqqq('node-localstorage').LocalStorage;
    return new LocalStorage('./unique');
  }
};

var __stored = {};

var memoryStore = function memoryStore() {
  return {
    getItem: function getItem(storageKey) {
      return __stored[storageKey] || null;
    },
    setItem: function setItem(storageKey, value) {
      __stored[storageKey] = value;
    }
  };
};

var _default = Unique;
exports.default = _default;