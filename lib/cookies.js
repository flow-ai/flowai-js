"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCookie = exports.setCookie = void 0;
var COOKIES_EXP_MS = 604800000;
/**
 * 
 * @param {string} name 
 * @param {string} value 
 */

var setCookie = function setCookie(name, value) {
  document.cookie = "".concat(encodeURIComponent(name), "=").concat(value, ";expires=").concat(new Date(Date.now() + COOKIES_EXP_MS));
};
/**
 * 
 * @param {string} name 
 * @returns {string}
 */


exports.setCookie = setCookie;

var getCookie = function getCookie(name) {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];

    if (cookie.trim().startsWith(encodeURIComponent(name))) {
      return cookie.split('=')[1];
    }
  }
};

exports.getCookie = getCookie;