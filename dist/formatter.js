"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatType = formatType;
exports.formatResultSupplier = formatResultSupplier;

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