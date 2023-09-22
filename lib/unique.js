"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _debug = _interopRequireDefault(require("debug"));
var _uuidV = _interopRequireDefault(require("uuid-v4"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var reqqq = require;
(0, _debug.default)('flowai:unique');
var COOKIES_EXP_MS = 604800000;

/**
 * 
 * @param {string} name 
 * @param {string} value 
 */
var _setCookie = function _setCookie(name, value) {
  document.cookie = "".concat(encodeURIComponent(name), "=").concat(value, ";expires=").concat(new Date(Date.now() + COOKIES_EXP_MS));
};
/**
 * 
 * @param {string} name 
 * @returns {string}
 */
var _getCookie = function _getCookie(name) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    if (cookie.trim().startsWith(encodeURIComponent(name))) {
      return cookie.split('=')[1];
    }
  }
};

/**
 * Generates and stores a unique ID
 * @class
 * @private
 **/
var Unique = /*#__PURE__*/function () {
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
        _setCookie(this._storageKey, value);
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
        uniqueId = _getCookie(this._storageKey);
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
        return !!_getCookie(storageKey);
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
        return _getCookie(storageKey);
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