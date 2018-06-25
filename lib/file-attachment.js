'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

var _attachment = require('./attachment');

var _attachment2 = _interopRequireDefault(_attachment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Send a file as attachment
 * @class
 *
 * @example
 * // Web example
 *
 * var originator = new Originator({
 *   name: 'Jane'
 * })
 *
 * var file = fileInputElement.files[0]
 *
 * const message = new Message({
 *   attachment: new FileAttachment(file)
 * })
 *
 * client.send(message)
 *
 * @example
 * // Nodejs example
 * import { createReadStream } from 'fs'
 *
 * const originator = new Originator({
 *   name: 'Jane'
 * })
 *
 * // Load ReadStream from file on disk
 * const data = fs.createReadStream('/foo/bar.jpg')
 *
 * const message = new Message({
 *   attachment: new FileAttachment(data)
 * })
 *
 * client.send(message)
 **/
var FileAttachment = function (_Attachment) {
  _inherits(FileAttachment, _Attachment);

  /**
   * Constructor
   * @param {File|ReadStream} data - File or Blob in the browser, ReadStream in Nodejs
   **/
  function FileAttachment(data) {
    _classCallCheck(this, FileAttachment);

    var formData = new _formData2.default();
    formData.append('file', data);

    return _possibleConstructorReturn(this, (FileAttachment.__proto__ || Object.getPrototypeOf(FileAttachment)).call(this, 'file', {
      formData: formData
    }));
  }

  return FileAttachment;
}(_attachment2.default);

exports.default = FileAttachment;