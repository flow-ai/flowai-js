'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _fetchEverywhere = require('fetch-everywhere');

var _fetchEverywhere2 = _interopRequireDefault(_fetchEverywhere);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(0, _debug2.default)('flowai:rest');

// Private class

var Rest = function () {
  function Rest(endpoint) {
    _classCallCheck(this, Rest);

    (0, _debug2.default)('Creating a new REST service with endpoint \'' + endpoint + '\'');
    this._endpoint = endpoint;
  }

  _createClass(Rest, [{
    key: 'get',
    value: function get(options) {
      var path = options.path,
          token = options.token,
          queryParams = options.queryParams;


      var url = this._endpoint + '/' + path,
          headers = this._createHeaders(token);

      (0, _debug2.default)('GET call to url \'' + url + '\' with headers and queryParams', headers, queryParams);

      return this._call(url, { headers: headers }, queryParams);
    }
  }, {
    key: 'post',
    value: function post(options) {
      var path = options.path,
          token = options.token,
          payload = options.payload,
          queryParams = options.queryParams;


      var url = this._endpoint + '/' + path,
          headers = this._createHeaders(token);

      var enveloppe = {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(payload || {})
      };

      (0, _debug2.default)('POST call to url \'' + url + '\' with headers and enveloppe', headers, enveloppe);

      return this._call(url, enveloppe, queryParams);
    }
  }, {
    key: '_createHeaders',
    value: function _createHeaders(token) {
      var headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers = Object.assign(headers, {
          Authorization: 'Bearer ' + token
        });
      }

      return headers;
    }
  }, {
    key: '_call',
    value: function _call(url, enveloppe, queryParams) {
      return new Promise(function (resolve, reject) {
        if (queryParams) {
          url = url + '?' + _querystring2.default.stringify(queryParams);
        }

        (0, _debug2.default)('Calling URL \'' + url + '\'');

        (0, _fetchEverywhere2.default)(url, enveloppe).then(function (response) {
          resolve(response.json());
        }).catch(function (err) {
          (0, _debug2.default)('Failed with error', err);
          reject(err);
        });
      });
    }
  }]);

  return Rest;
}();

exports.default = Rest;