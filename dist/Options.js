"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _formatter = require("./formatter");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Options = /*#__PURE__*/function () {
  /**
   * URL of the Photon API to use
   * @type {string}
   */

  /**
   * Limit number of results
   * @type {number}
   */

  /**
   * Function to control the way features types (amenity, school, etc.) are displayed in the default
   * formatResult function
   * @type {Function}
   */

  /**
   * Function to control the way geojson features are displayed in the results box
   * @type {Function}
   */

  /**
   * Latitude to make search with priority to a geo position
   * @type {number}
   */

  /**
   * Longitude to make search with priority to a geo position
   * @type {number}
   */

  /**
   * Preferred language
   * @type {string}
   */
  function Options(options) {
    _classCallCheck(this, Options);

    _defineProperty(this, "url", 'https://photon.komoot.io');

    _defineProperty(this, "limit", 5);

    _defineProperty(this, "formatType", null);

    _defineProperty(this, "formatResult", null);

    _defineProperty(this, "lat", null);

    _defineProperty(this, "lon", null);

    _defineProperty(this, "lang", null);

    options && Object.assign(this, options);
  }

  _createClass(Options, [{
    key: "api",
    get: function get() {
      return this.url + '/api/';
    }
  }, {
    key: "reverse",
    get: function get() {
      return this.url + '/reverse';
    }
  }, {
    key: "formatResultFunc",
    get: function get() {
      return this.formatResult || (0, _formatter.formatResultSupplier)(this.formatType || _formatter.formatType);
    }
  }, {
    key: "reqParams",
    get: function get() {
      var reqParams = {
        limit: this.limit
      };

      if (this.lat && this.lon) {
        reqParams.lat = this.lat;
        reqParams.lon = this.lon;
      }

      if (this.lang) {
        reqParams.lang = this.lang;
      }

      return reqParams;
    }
  }]);

  return Options;
}();

exports["default"] = Options;