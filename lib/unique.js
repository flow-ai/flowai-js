'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _uuidV = require('uuid-v4');

var _uuidV2 = _interopRequireDefault(_uuidV);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(0, _debug2.default)('flowai:unique');

// Private class

var Unique = function () {
  function Unique(opts) {
    _classCallCheck(this, Unique);

    if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') {
      throw new Error('Required options must be an object');
    }

    var clientId = opts.clientId,
        key = opts.key,
        value = opts.value,
        engine = opts.engine;


    if (typeof clientId !== 'string' || !clientId.length) {
      throw new Error('Invalid clientId provided');
    }

    if (typeof key !== 'string' || key.length < 2) {
      throw new Error('Invalid key provided');
    }

    if (typeof engine !== 'string') {
      throw new Error('Storage engine must be provided, either local or session');
    }

    this._storageKey = clientId + '.' + key;
    this._storage = createStorage(engine);

    (0, _debug2.default)('Creating a new Unique with key \'' + key + '\' and value \'' + value + '\'');

    value && this._storage.setItem(this._storageKey, value);
  }

  _createClass(Unique, [{
    key: 'id',
    value: function id() {
      var uniqueId = this._storage.getItem(this._storageKey);
      if (!uniqueId) {
        // Remove dashes
        uniqueId = (0, _uuidV2.default)().replace(/-/g, '');

        (0, _debug2.default)('Creating a new uniqueId \'' + uniqueId + '\'');

        this._storage.setItem(this._storageKey, uniqueId);
      }

      (0, _debug2.default)('Returning uniqueId \'' + uniqueId + '\'');

      return uniqueId;
    }

    /**
     * See if a key exists in storageKey
     **/

  }], [{
    key: 'exists',
    value: function exists(opts) {

      if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') {
        throw new Error('Required options must be an object');
      }

      var clientId = opts.clientId,
          key = opts.key,
          engine = opts.engine;


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
      var storageKey = clientId + '.' + key;
      return storage && storage.getItem(storageKey) !== null;
    }
  }]);

  return Unique;
}();

var createStorage = function createStorage(engine) {
  if (typeof localStorage === "undefined" || localStorage === null) {
    // Server side storage
    var LocalStorage = require('node-localstorage').LocalStorage;
    return new LocalStorage('./unique');
  }

  if (engine === 'session') {
    return sessionStorage;
  }

  return localStorage;
};

exports.default = Unique;