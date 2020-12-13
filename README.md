# typeahead-address-photon [![npm](https://img.shields.io/npm/v/typeahead-address-photon.svg)](http://npm.im/typeahead-address-photon) 

Copy of famous [typeahead-addresspicker](https://github.com/sgruhier/typeahead-addresspicker)
but using free and Open-Source place search service https://photon.komoot.io/.

Provides `PhotonAddressEngine`, an implementation of suggestions engine [Bloodhound](https://github.com/twitter/typeahead.js/blob/master/doc/bloodhound.md) (from corejs-typeahead).

Plugin provides convinient hooks if you wanna make other processing of suggested places, rather than only show them in the drop-down list of typeahead. For example, you can choose to pin markers on [Leaflet](http://leafletjs.com/) map in suggested places while typing.

<img src="https://raw.github.com/komoot/typeahead-address-photon/master/doc/screenshot.png"/>

### Note
[corejs-typeahead](https://github.com/corejavascript/typeahead.js) is maintained fork of original [twitter typeahead](http://twitter.github.io/typeahead.js/). It's strongly recommended to switch on corejs-typeahead if you still use the old one.

## Demo
Check out the [demo](http://komoot.github.io/typeahead-address-photon/).

## How to use
Include jQuery, corejs-typeahead & typeahead-address-photon on your page :
```xml
<!-- We assume vendor_scripts to be a folder with third party libraries
     (often node_modules or bower_components) -->
<script src="vendor_scripts/jquery/dist/jquery.js"></script>
<script src="vendor_scripts/corejs-typeahead/dist/typeahead.bundle.js"></script>
<script src="vendor_scripts/typeahead-address-photon/dist/typeahead-address-photon.js"></script>
```
Add text input for address :
```xml
<input id="inpAddress" type="text" placeholder="Enter address here..."></input>
```

Instanciate `PhotonAddressEngine` and `Typeahead` :
```javascript
var engine = new PhotonAddressEngine();

$('#inpAddress').typeahead(null, {
  source: engine.ttAdapter(),
  displayKey: 'description'
});
```

### Options
`PhotonAddressEngine` constructor accepts object with options. The following options can be provided :
- `url` - URL of the Photon API to use. *Default: 'https://photon.komoot.io'*
- `limit` - limit number of results. *Default: 5*
- `formatResult` - function to control the way geojson features are displayed in the results box
- `formatType` - function to control the way features types (amenity, school, etc.) are displayed in the default formatResult function
- `lat`, `lon` - latitude and longitude to make search with priority to a geo position
- `lang` - preferred language

### Events
Instance of `PhotonAddressEngine` can trigger two kind of events that allows you make your own processing of fetched OSM features.
- `addresspicker:selected` - triggered when user selects one of suggestions, has OSM feature corresponding to selected place as parameter
- `addresspicker:predictions` - triggered when suggestions are fetched for provided request, has all fetched OSM features as parameter

You can subscribe for those events as following :
```javascript
$(engine).bind('addresspicker:selected', function (event, selectedPlace) {
  // Process selected place here ...
});

$(engine).bind('addresspicker:predictions', function (event, suggestions) {
  // Process all suggestions here ...
});
```

### Reverse geocoding
Reverse geocoding allows to fetch places by geographic coordinates rather than by text query. This feature can be usefull when working with Leaflet map. For example, user drags marker and address input is automatically updated with new place. To do reverse geocoding use method `PhotonAddressEngine.reverseGeocode([lat, lon])` that accepts array with coordinates and triggers event `addresspicker:selected` with first suggested result. Use it as following :

```javascript
$(engine).bind('addresspicker:selected', function (event, selectedPlace) {
  // Process selected place here ...
});
...
engine.reverseGeocode([ pos.lat, pos.lng ]);
```
