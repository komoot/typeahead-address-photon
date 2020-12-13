/**
 * Default function that returns string representation of OSM place type.
 * Used by default implementation of method formatResult.
 *
 * @param feature photon feature
 * @return formatted string representation of OSM place type
 */
export function formatType(feature) {
  return feature.properties.osm_value;
}

/**
 * Supplier of default formatResult function.
 *
 * @param formatType implementation of formatType function
 * @return default implementation of formatResult function
 */
export function formatResultSupplier(formatType) {
  return (feature) => {
    const type = formatType(feature);
    let formatted = feature.properties.name;

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
