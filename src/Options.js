import {formatResultSupplier, formatType} from './formatter';

export default class Options {

  /**
   * URL of the Photon API to use
   * @type {string}
   */
  url = 'https://photon.komoot.io';

  /**
   * Limit number of results
   * @type {number}
   */
  limit = 5;

  /**
   * Function to control the way features types (amenity, school, etc.) are displayed in the default
   * formatResult function
   * @type {Function}
   */
  formatType = null;

  /**
   * Function to control the way geojson features are displayed in the results box
   * @type {Function}
   */
  formatResult = null;

  /**
   * Latitude to make search with priority to a geo position
   * @type {number}
   */
  lat = null;

  /**
   * Longitude to make search with priority to a geo position
   * @type {number}
   */
  lon = null;

  /**
   * Preferred language
   * @type {string}
   */
  lang = null;

  constructor(options) {
    options && Object.assign(this, options);
  }

  get api() {
    return this.url + '/api/';
  }

  get reverse() {
    return this.url + '/reverse';
  }

  get formatResultFunc() {
    return this.formatResult || formatResultSupplier(this.formatType || formatType);
  }

  get reqParams() {
    let reqParams = {
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
}
