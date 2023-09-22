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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
(0, _debug.default)('flowai:rest');
var checkStatus = function checkStatus(silent) {
  return function (response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error;
      switch (response.status) {
        case 500:
        // DIRTY FIX!
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
};

// Private class
var Rest = /*#__PURE__*/function () {
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
        headers: _objectSpread(_objectSpread({}, headers), options.headers)
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