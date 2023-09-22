"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _debug = _interopRequireDefault(require("debug"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
(0, _debug.default)('flowai:originator');

/**
 * Originator of a Message
 * @class
 * @property {string} name - Name of a person or system originating the Message, default is Anonymous
 * @property {string} role - The role of the person. You cannot set this, default is external
 * @property {?Object} profile - Contains profile info
 * @property {string} profile.fullName - First and surname combined
 * @property {string} profile.firstName - First name of the person
 * @property {string} profile.lastName - Last name of the person
 * @property {string} profile.email - E-mail address
 * @property {string} profile.description - Description of this user
 * @property {string} profile.picture - Profile picture (url)
 * @property {string} profile.locale - ISO code describing language and country (en-US)
 * @property {number} profile.timezone - Hours from GMT
 * @property {string} profile.location - Location of the user
 * @property {string} profile.gender - M for male, F for female or U for unknown / other
 * @property {object} metadata - Optional object with custom metadata
 **/
var Originator = /*#__PURE__*/_createClass(
/**
 * @constructor
 * @param {Object} opts
 * @param {string} opts.name - Name of a person or system originating the Message, default is Anonymous
 * @param {string} opts.role - The role of the person. You cannot set this, default is external
 * @param {?Object} opts.profile - Contains profile info
 * @param {string} opts.profile.fullName - First and surname combined
 * @param {string} opts.profile.firstName - First name of the person
 * @param {string} opts.profile.lastName - Last name of the person
 * @param {string} opts.profile.email - E-mail address
 * @param {string} opts.profile.description - Description of this user
 * @param {string} opts.profile.picture - Profile picture (url)
 * @param {string} opts.profile.locale - ISO code describing language and country (en-US)
 * @param {number} opts.profile.timezone - Hours from GMT
 * @param {string} opts.profile.location - Location of the user
 * @param {string} opts.profile.gender - M for male, F for female or U for unknown / other
 * @param {object} opts.metadata - Optional object with custom metadata
 **/
function Originator(opts) {
  _classCallCheck(this, Originator);
  var data = opts || {};
  this.name = data.name || 'Anonymous';
  this.role = data.role || 'external';
  var profile = data.profile || {};
  this.profile = {
    fullName: profile.fullName || undefined,
    firstName: profile.firstName || undefined,
    lastName: profile.lastName || undefined,
    email: profile.email || undefined,
    description: profile.description || undefined,
    picture: profile.picture || undefined,
    locale: profile.locale || undefined,
    timezone: profile.timezone || undefined,
    location: profile.location || undefined,
    gender: profile.gender || undefined
  };
  this.metadata = data.metadata || undefined;
});
var _default = Originator;
exports.default = _default;