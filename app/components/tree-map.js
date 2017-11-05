import Ember from 'ember';

const ACCESS_TOKEN = 'pk.eyJ1Ijoic2VldHJlZSIsImEiOiJjajNpcmRqdnYwMGhmMzJwNjFyYzB6eHRqIn0.Z-tXa242x-sr9K0mSpsxaw';

export default Ember.Component.extend({
  issueManager: Ember.inject.service(),
  issueSerializer: Ember.inject.service(),

  didInsertElement() {
    this.get('issueManager').all()
      .then(data => {
        const geojson = this.get('issueSerializer').deserialize(data);

        mapboxgl.accessToken = ACCESS_TOKEN

        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/satellite-v9',
          center: [32.4029777, 34.958337],
          zoom: 5
        });

        map.on('click', 'trees', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.description)
            .addTo(map);
        });

        map.on('load', function () {
          map.addSource('trees', {
            'type': 'geojson',
            'data': geojson
          });

        geojson.features.forEach(issue => {
          let symbol = issue.properties['icon'],
            category = issue.properties['category'],
            layerID = category;

          if (!map.getLayer(layerID)) {
            map.addLayer({
               'id': layerID,
                'type': 'symbol',
                'source': 'trees',
                'layout': {
                  'icon-image': `${symbol}-15`,
                  'icon-allow-overlap': true,
                },
                'filter': ['==', 'category', category]
            });

            map.on('click', layerID, function (e) {
              new mapboxgl.Popup()
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML(e.features[0].properties.description)
                .addTo(map);
            });

            let input = document.createElement('input'),
              filterGroup = document.getElementById('filter-group'),
              label = document.createElement('label');

            input.type = 'checkbox';
            input.id = layerID;
            input.checked = true;
            filterGroup.appendChild(input);

            label.setAttribute('for', layerID);
            label.textContent = layerID;
            filterGroup.appendChild(label);

            input.addEventListener('change', function (e) {
              map.setLayoutProperty(layerID, 'visibility',
                e.target.checked ? 'visible' : 'none');
            });
          }
        })
      })
    })
  }
});
