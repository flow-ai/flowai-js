"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _debug = _interopRequireDefault(require("debug"));

var _querystring = _interopRequireDefault(require("querystring"));

var _fetchEverywhere = _interopRequireDefault(require("fetch-everywhere"));

var _exception = _interopRequireDefault(require("./exception"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(0, _debug.default)('flowai:rest');

var checkStatus = function checkStatus(silent) {
  return function (response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error;

      switch (response.status) {
        case 500: // DIRTY FIX!
        // case 503:

        case 400:
          {
            if (silent !== true) {
              console.error('It seems your clientId, sessionId or configuration is invalid');
            }

            error = new _exception.default('Failed to connect with API. Invalid clientId, sessionId or configuration', 'connection', new Error(response.status), true);
            break;
          }

        case 401:
        case 402:
        case 403:
          {
            if (silent !== true) {
              console.error('It seems your domain is not whitelisted properly');
            }

            error = new _exception.default('Unauthorized Error', 'connection', new Error(response.status), true);
            break;
          }

        default:
          {
            if (silent !== true) {
              console.error('An error occurred at the Flow.ai API. Please contact us at slack.flow.ai');
            }

            error = new _exception.default('Failed to connect with API', 'connection', new Error(response.status));
            break;
          }
      }

      throw error;
    }
  };
}; // Private class


var Rest =
/*#__PURE__*/
function () {
  function Rest(endpoint, silent) {
    _classCallCheck(this, Rest);

    (0, _debug.default)("Creating a new REST service with endpoint '".concat(endpoint, "'"));
    this._endpoint = endpoint;
    this._silent = silent;
  }

  _createClass(Rest, [{
    key: "get",
    value: function get(options) {
      var path = options.path,
          token = options.token,
          queryParams = options.queryParams;

      var url = "".concat(this._endpoint, "/").concat(path),
          headers = this._createHeaders(token);

      (0, _debug.default)("GET call to url '".concat(url, "' with headers and queryParams"), headers, queryParams);
      return this._call(url, {
        headers: _objectSpread({}, headers, options.headers)
      }, queryParams);
    }
  }, {
    key: "post",
    value: function post(options) {
      var path = options.path,
          token = options.token,
          payload = options.payload,
          queryParams = options.queryParams;

      var url = "".concat(this._endpoint, "/").concat(path),
          headers = this._createHeaders(token);

      var enveloppe = {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(payload || {})
      };
      (0, _debug.default)("POST call to url '".concat(url, "' with headers and enveloppe"), headers, enveloppe);
      return this._call(url, enveloppe, queryParams);
    }
  }, {
    key: "upload",
    value: function upload(formData, headers) {
      (0, _debug.default)('Uploading', formData);
      var url = "".concat(this._endpoint, "/thread.upload");
      return new Promise(function (resolve, reject) {
        var enveloppe = {
          method: 'POST',
          body: formData
        };

        if (_typeof(headers) === 'object') {
          enveloppe.headers = headers;
        }

        (0, _debug.default)("Calling URL '".concat(url, "'"));
        (0, _fetchEverywhere.default)(url, enveloppe).then(function (response) {
          // Checking the response status
          if (response.status == 413) {
            throw new Error('Upload is too large');
          } else if (response.status >= 400) {
            throw new Error('Failed to upload files');
          }

          resolve(response.json());
        }).catch(function (err) {
          (0, _debug.default)('Failed with error', err);
          reject(err);
        });
      });
    }
  }, {
    key: "_createHeaders",
    value: function _createHeaders(token) {
      var headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers = Object.assign(headers, {
          Authorization: "Bearer ".concat(token)
        });
      }

      return headers;
    }
  }, {
    key: "_call",
    value: function _call(url, enveloppe, queryParams) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (queryParams) {
          url = "".concat(url, "?").concat(_querystring.default.stringify(queryParams));
        }

        (0, _debug.default)("Calling URL '".concat(url, "'"));
        (0, _fetchEverywhere.default)(url, enveloppe).then(checkStatus(_this._silent)).then(function (response) {
          resolve(response.json());
        }).catch(function (err) {
          (0, _debug.default)('Failed with error', err);
          reject(err);
        });
      });
    }
  }]);

  return Rest;
}();

var _default = Rest;
exports.default = _default;