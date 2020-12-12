const func = function (root, $, Bloodhound) {
  'use strict';
  /**
   * Default function that returns string representation of OSM place type.
   * Used by default implementation of method formatResult.
   *
   * @param feature photon feature
   *
   * @return formatted string representation of OSM place type
   */

  var _formatType = function (feature) {
    return feature.properties.osm_value;
  };
  /**
   * Supplier of default formatResult function.
   *
   * @param formatType implementation of formatType function
   *
   * @return default implementation of formatResult function
   */


  var _formatResultSupplier = function (formatType) {
    return function (feature) {
      var formatted = feature.properties.name,
          type = formatType(feature);

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
  };
  /**
   * Constructor of suggestion engine. Take options as litteral object. All
   * options are optionals.
   *
   * @param options#url URL of the Photon API to use. Default:
   *        'http://photon.komoot.de'
   * @param options#limit limit number of results. Default: 5
   * @param options#formatResult function to control the way geojson features
   *        are displayed in the results box
   * @param options#formatType function to control the way features types
   *        (amenity, school, etc.) are displayed in the default formatResult
   *        function
   * @param options#lat, options#lon latitude and longitude to make search with
   *        priority to a geo position
   * @param options#lang preferred language
   */


  root.PhotonAddressEngine = function (options) {
    options = options || {};

    var formatType = options.formatType || _formatType,
        formatResult = options.formatResult || _formatResultSupplier(formatType),
        url = options.url || 'http://photon.komoot.de',
        limit = options.limit || 5,
        reqParams = {};

    if (options.lat && options.lon) {
      reqParams.lat = options.lat;
      reqParams.lon = options.lon;
    }

    if (options.lang) {
      reqParams.lang = options.lang;
    }

    reqParams.limit = limit;
    var bloodhound = new Bloodhound({
      local: [],
      queryTokenizer: Bloodhound.tokenizers.nonword,
      datumTokenizer: function (feature) {
        return Bloodhound.tokenizers.obj.whitespace(['country', 'city', 'postcode', 'name', 'state'])(feature.properties);
      },
      identify: function (feature) {
        return feature.properties.osm_id;
      },
      remote: {
        url: url + '/api/',
        sufficient: limit,
        prepare: function (query, settings) {
          settings.data = reqParams;
          settings.data.q = query;
          return settings;
        },
        transform: function (response) {
          var self = this;
          response.features.forEach(function (feature) {
            feature.description = formatResult(feature);
          });
          return response.features || [];
        }
      }
    });
    /* Redefine bloodhound.search(query, sync, async) function */

    var _oldSearch = bloodhound.search;

    bloodhound.search = function (query, sync, async) {
      var syncPromise = jQuery.Deferred(),
          asyncPromise = jQuery.Deferred();

      _oldSearch.call(bloodhound, query, function (datums) {
        syncPromise.resolve(datums);
      }, function (datums) {
        asyncPromise.resolve(datums);
      });

      $.when(syncPromise, asyncPromise).then(function (syncResults, asyncResults) {
        var allResults = [].concat(syncResults, asyncResults);
        $(bloodhound).trigger('addresspicker:predictions', [allResults]);
        sync(syncResults);
        async(asyncResults);
      });
    };
    /**
     * Transforms default typeahead event typeahead:selected to
     * addresspicker:selected. The same event is triggered by
     * bloodhound.reverseGeocode.
     *
     * @param typeahead jquery wrapper around address input
     */


    bloodhound.bindDefaultTypeaheadEvent = function (typeahead) {
      typeahead.bind('typeahead:selected', function (event, place) {
        $(bloodhound).trigger('addresspicker:selected', [place]);
      });
    };
    /**
     * Makes reverse geocoding of position and triggers event
     * addresspicker:selected with result.
     *
     * @param position array with latitude & longitude
     */


    bloodhound.reverseGeocode = function (position) {
      $.get(url + '/reverse', {
        lat: position[0],
        lon: position[1]
      }).then(function (response) {
        if (response.features) {
          var feature = response.features[0];
          feature.description = formatResult(feature);
          $(bloodhound).trigger('addresspicker:selected', [feature]);
        }
      });
    };
    /* test-code */


    bloodhound.__testonly__ = {};
    bloodhound.__testonly__.defaultFormatType = _formatType;
    bloodhound.__testonly__.defaultFormatResult = _formatResultSupplier(_formatType);
    /* end-test-code */

    return bloodhound;
  };
};

func(this, jQuery, Bloodhound);