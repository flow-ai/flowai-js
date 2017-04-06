'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(0, _debug2.default)('flowai:originator');

/**
 * Originator of a Message
 * @class
 * @property {string} name - Name of a person or system originating the Message
 * @property {string} profile.fullName - First and surname of person
 * @property {string} profile.firstName - First name of the person
 * @property {string} profile.lastName - Last name of the person
 * @property {string} profile.picture - Profile picture (url)
 * @property {string} profile.locale - ISO code describing language and country (en-US)
 * @property {string} profile.gender - M for male, F for female or U for unknown / other
 **/

var Originator = function Originator(data) {
  _classCallCheck(this, Originator);

  this.name = data.name || 'Anonymous';
  this.role = data.role || 'external';

  var profile = data.profile || {};
  this.profile = {
    fullName: profile.fullName || undefined,
    firstName: profile.firstName || undefined,
    lastName: profile.lastName || undefined,
    picture: profile.picture || undefined,
    locale: profile.locale || undefined,
    gender: profile.gender || undefined
  };
};

exports.default = Originator;