import Bloodhound from 'corejs-typeahead/dist/bloodhound';
import Options from './Options';

export default class PhotonAddressEngine extends Bloodhound {
  options;
  jQuery;

  constructor(options, $ = window.$) {
    options = new Options(options);

    super({
      local: [],
      queryTokenizer: Bloodhound.tokenizers.nonword,
      datumTokenizer: PhotonAddressEngine.datumTokenizer,
      identify: PhotonAddressEngine.identify,
      remote: {
        url: options.api,
        sufficient: options.limit,
        prepare: (query, settings) => {
          settings.data = options.reqParams;
          settings.data.q = query;
          return settings;
        },
        transform: (response) => {
          response.features.forEach((feature) => {
            feature.description = options.formatResultFunc(feature);
          });

          return response.features || [];
        }
      }
    });

    this.options = options;
    this.jQuery = $;
  }

  search(query, sync, async) {
    const syncPromise = this.jQuery.Deferred();
    const asyncPromise = this.jQuery.Deferred();

    super.search(query, (datums) => {
      syncPromise.resolve(datums);
    }, (datums) => {
      asyncPromise.resolve(datums);
    });

    this.jQuery.when(syncPromise, asyncPromise)
      .then((syncResults, asyncResults) => {
        const allResults = [].concat(syncResults, asyncResults);

        this.jQuery(this).trigger('addresspicker:predictions', [ allResults ]);

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
  bindDefaultTypeaheadEvent(typeahead) {
    typeahead.bind('typeahead:selected', (event, place) => {
      this.jQuery(this).trigger('addresspicker:selected', [ place ]);
    });
  }

  /**
   * Makes reverse geocoding of position and triggers event
   * 'addresspicker:selected' with result.
   *
   * @param position array with latitude & longitude
   */
  reverseGeocode(position) {
    this.jQuery.get(this.options.reverse, {
      lat: position[0],
      lon: position[1]
    }).then((response) => {
      if (response.features) {
        const firstFeature = response.features[0];
        firstFeature.description = this.options.formatResultFunc(firstFeature);

        this.jQuery(this).trigger('addresspicker:selected', [ firstFeature ]);
      }
    });
  }

  static datumTokenizer(feature) {
    return Bloodhound.tokenizers.obj.whitespace([
      'country', 'city', 'postcode', 'name', 'state'
    ])(feature.properties);
  }

  static identify(feature) {
    return feature.properties.osm_id;
  }
}
