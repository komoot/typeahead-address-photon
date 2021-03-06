import jasmineHttpServerSpy from 'jasmine-http-server-spy';
import PhotonAddressEngine from '../src/PhotonAddressEngine';
import 'jasmine-expect';
import $ from 'jquery';

describe('PhotonAddressEngine', () => {
  let httpSpy;

  beforeAll(done => {
    httpSpy = jasmineHttpServerSpy.createSpyObj('mockServer', [{
      method: 'get',
      url: '/api/',
      handlerName: 'getSuggestions'
    }, {
      method: 'get',
      url: '/reverse',
      handlerName: 'getReverse'
    }]);
    httpSpy.server.start(8082, done);
  });

  afterAll(() => {
    httpSpy.server.stop();
  });

  afterEach(() => {
    httpSpy.getSuggestions.calls.reset();
  });

  it('Test basic query', done => {

    // Given
    const engine = new PhotonAddressEngine({
          url: 'http://localhost:8082'
        }, $),
        asyncHandlerCalled = $.Deferred(),
        predictionsEventFired = $.Deferred(),
        response = {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'coordinates': [
                  13.438596,
                  52.519854
                ],
                'type': 'Point'
              },
              'properties': {
                'city': 'Berlin',
                'country': 'Germany',
                'name': 'Berlin'
              }
            },{
              'type': 'Feature',
              'geometry': {
                'coordinates': [
                  61.195088,
                  54.005826
                ],
                'type': 'Point'
              },
              'properties': {
                'country': 'Russia',
                'name': 'Berlin',
                'postcode': '457130'
              }
            }
          ]
        };

    httpSpy.getSuggestions.and.returnValue({
      statusCode: 200,
      body: response
    });

    // When
    $(engine).bind('addresspicker:predictions', (event, predictions) => {
      predictionsEventFired.resolve(predictions);
    });

    engine.ttAdapter()(
        'berlin',
        () => {},
        asyncHandlerCalled.resolve);

    // Then
    $.when(asyncHandlerCalled, predictionsEventFired)
        .then((res1, res2) => {
          expect(httpSpy.getSuggestions).toHaveBeenCalledWith(
              jasmine.objectContaining({
                query: {
                  limit: '5',
                  q: 'berlin'
                }
              }));

          expect(res1).toEqual(res2);

          expect(res1).toBeArrayOfSize(2);
          expect(res1).toBeArrayOfObjects();
          expect(res1[0].description).toBe('Berlin, Germany');
          expect(res1[1].description).toBe('Berlin, Russia');

          done();
        });
  });

  it('Test query with all parameters', done => {

    // Given
    const engine = new PhotonAddressEngine({
          url: 'http://localhost:8082',
          limit: 42,
          lat: 48.847547,
          lon: 2.351074,
          lang: 'fr',
          formatResult: (feature) => {
            return 'City of ' + feature.properties.name + ' in ' + feature.properties.country;
          }
        }, $),
        response = {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'coordinates': [
                  13.438596,
                  52.519854
                ],
                'type': 'Point'
              },
              'properties': {
                'city': 'Berlin',
                'country': 'Germany',
                'name': 'Berlin'
              }
            },{
              'type': 'Feature',
              'geometry': {
                'coordinates': [
                  61.195088,
                  54.005826
                ],
                'type': 'Point'
              },
              'properties': {
                'country': 'Russia',
                'name': 'Berlin',
                'postcode': '457130'
              }
            }
          ]
        };

    httpSpy.getSuggestions.and.returnValue({
      statusCode: 200,
      body: response
    });

    // When
    engine.ttAdapter()(
        'berlin',
        () => {},
        (asyncResults) => {

          // Then
          expect(httpSpy.getSuggestions).toHaveBeenCalledWith(
              jasmine.objectContaining({
                query: {
                  q: 'berlin',
                  limit: '42',
                  lat: '48.847547',
                  lon: '2.351074',
                  lang: 'fr'
                }
              }));

          expect(asyncResults).toBeArrayOfSize(2);
          expect(asyncResults).toBeArrayOfObjects();
          expect(asyncResults[0].description).toBe('City of Berlin in Germany');
          expect(asyncResults[1].description).toBe('City of Berlin in Russia');

          done();
        });
  });

  it('Test reverse geocoding', done => {

    // Given
    const engine = new PhotonAddressEngine({
          url: 'http://localhost:8082'
        }, $),
        response = {
          'features':[
            {
              'geometry':{
                'coordinates':[
                  2.292699793534485,
                  48.8629589
                ],
                'type':'Point'
              },
              'type':'Feature',
              'properties':{
                'osm_id':1191380,
                'osm_type':'R',
                'extent':[
                  2.2924314,
                  48.8631915,
                  2.2931421,
                  48.8627112
                ],
                'country':'France',
                'osm_key':'building',
                'housenumber':'2',
                'city':'Paris',
                'street':'Avenue d\'Iéna',
                'osm_value':'yes',
                'postcode':'75116',
                'name':'Centre culturel Coréen',
                'state':'Île-de-France'
              }
            },
            {
              'geometry':{
                'coordinates':[
                  2.2926042,
                  48.8630519
                ],
                'type':'Point'
              },
              'type':'Feature',
              'properties':{
                'osm_id':938888191,
                'osm_type':'N',
                'country':'France',
                'osm_key':'place',
                'housenumber':'2',
                'city':'Paris',
                'street':'Avenue d\'Iéna',
                'osm_value':'house',
                'postcode':'75016;75116',
                'state':'Île-de-France'
              }
            }
          ],
          'type':'FeatureCollection'
        };

    httpSpy.getReverse.and.returnValue({
      statusCode: 200,
      body: response
    });

    // Then
    $(engine).bind('addresspicker:selected', (event, selected) => {
      expect(selected).toBeObject();
      expect(selected).toBeNonEmptyObject();
      expect(selected.description).toBe('Centre culturel Coréen, yes, Paris, France');

      done();
    });

    // When
    engine.reverseGeocode([ 48.862869100279056, 2.292462587356568 ]);
  });
});

