(function (Bloodhound) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Bloodhound__default = /*#__PURE__*/_interopDefaultLegacy(Bloodhound);

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  /**
   * Default function that returns string representation of OSM place type.
   * Used by default implementation of method formatResult.
   *
   * @param feature photon feature
   * @return formatted string representation of OSM place type
   */
  function formatType(feature) {
    return feature.properties.osm_value;
  }
  /**
   * Supplier of default formatResult function.
   *
   * @param formatType implementation of formatType function
   * @return default implementation of formatResult function
   */

  function formatResultSupplier(formatType) {
    return function (feature) {
      var type = formatType(feature);
      var formatted = feature.properties.name;

      if (type) {
        formatted += ', ' + type;
      }

      if (feature.properties.city && feature.properties.city !== feature.properties.name) {
        formatted += ', ' + feature.properties.city;
      }

      if (feature.properties.country) {
        formatted += ', ' + feature.properties.country;
      }

      return formatted;
    };
  }

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
        return this.formatResult || formatResultSupplier(this.formatType || formatType);
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

  var PhotonAddressEngine = /*#__PURE__*/function (_Bloodhound) {
    _inherits(PhotonAddressEngine, _Bloodhound);

    var _super = _createSuper(PhotonAddressEngine);

    function PhotonAddressEngine(options) {
      var _this;

      var $ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.$;

      _classCallCheck(this, PhotonAddressEngine);

      options = new Options(options);
      _this = _super.call(this, {
        local: [],
        queryTokenizer: Bloodhound__default['default'].tokenizers.nonword,
        datumTokenizer: PhotonAddressEngine.datumTokenizer,
        identify: PhotonAddressEngine.identify,
        remote: {
          url: options.api,
          sufficient: options.limit,
          prepare: function prepare(query, settings) {
            settings.data = options.reqParams;
            settings.data.q = query;
            return settings;
          },
          transform: function transform(response) {
            response.features.forEach(function (feature) {
              feature.description = options.formatResultFunc(feature);
            });
            return response.features || [];
          }
        }
      });

      _defineProperty(_assertThisInitialized(_this), "options", void 0);

      _defineProperty(_assertThisInitialized(_this), "jQuery", void 0);

      _this.options = options;
      _this.jQuery = $;
      return _this;
    }

    _createClass(PhotonAddressEngine, [{
      key: "search",
      value: function search(query, sync, async) {
        var _this2 = this;

        var syncPromise = this.jQuery.Deferred();
        var asyncPromise = this.jQuery.Deferred();

        _get(_getPrototypeOf(PhotonAddressEngine.prototype), "search", this).call(this, query, function (datums) {
          syncPromise.resolve(datums);
        }, function (datums) {
          asyncPromise.resolve(datums);
        });

        this.jQuery.when(syncPromise, asyncPromise).then(function (syncResults, asyncResults) {
          var allResults = [].concat(syncResults, asyncResults);

          _this2.jQuery(_this2).trigger('addresspicker:predictions', [allResults]);

          sync(syncResults);
          async(asyncResults);
        });
      }
      /**
       * Transforms default typeahead event 'typeahead:selected' to
       * 'addresspicker:selected'. The same event is triggered by
       * bloodhound.reverseGeocode.
       *
       * @param typeahead jquery wrapper around address input
       */

    }, {
      key: "bindDefaultTypeaheadEvent",
      value: function bindDefaultTypeaheadEvent(typeahead) {
        var _this3 = this;

        typeahead.bind('typeahead:selected', function (event, place) {
          _this3.jQuery(_this3).trigger('addresspicker:selected', [place]);
        });
      }
      /**
       * Makes reverse geocoding of position and triggers event
       * 'addresspicker:selected' with result.
       *
       * @param position array with latitude & longitude
       */

    }, {
      key: "reverseGeocode",
      value: function reverseGeocode(position) {
        var _this4 = this;

        this.jQuery.get(this.options.reverse, {
          lat: position[0],
          lon: position[1]
        }).then(function (response) {
          if (response.features) {
            var firstFeature = response.features[0];
            firstFeature.description = _this4.options.formatResultFunc(firstFeature);

            _this4.jQuery(_this4).trigger('addresspicker:selected', [firstFeature]);
          }
        });
      }
    }], [{
      key: "datumTokenizer",
      value: function datumTokenizer(feature) {
        return Bloodhound__default['default'].tokenizers.obj.whitespace(['country', 'city', 'postcode', 'name', 'state'])(feature.properties);
      }
    }, {
      key: "identify",
      value: function identify(feature) {
        return feature.properties.osm_id;
      }
    }]);

    return PhotonAddressEngine;
  }(Bloodhound__default['default']);

  window.PhotonAddressEngine = PhotonAddressEngine;

}(Bloodhound));
