import {formatResultSupplier, formatType} from '../src/formatter';

describe('Default formatters', () => {
  const feature = {
    'geometry': {
      'coordinates': [
        4.713735,
        46.4800832
      ],
      'type': 'Point'
    },
    'type': 'Feature',
    'properties': {
      'osm_id': 409086463,
      'osm_type': 'W',
      'extent': [
        4.7116237,
        46.4819855,
        4.7158754,
        46.477929
      ],
      'country': 'France',
      'osm_key': 'highway',
      'city': 'Cortambert',
      'osm_value': 'unclassified',
      'postcode': '71250',
      'name': 'Voie Communale n°5 de Cluny à Cortambert',
      'state': 'Bourgogne-Franche-Comté'
    }
  };

  it('should format feature type', () => {
    // When
    const formattedType = formatType(feature);

    // Then
    expect(formattedType)
        .toBe('unclassified');
  });

  it('should format feature', () => {
    // Given
    const formatFunction = formatResultSupplier(formatType);

    // When
    const formattedFeature = formatFunction(feature);

    // Then
    expect(formattedFeature)
        .toBe('Voie Communale n°5 de Cluny à Cortambert, unclassified, Cortambert, France');
  });
});
