// Define the layers from GeoServer
const layers = {
    no_poverty: new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'no_poverty', 'TILED': true},
            serverType: 'geoserver'
        }),
        visible: true
    }),
    zero_hunger: new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'zero_hunger', 'TILED': true},
            serverType: 'geoserver'
        }),
        visible: false
    }),
    good_health: new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'good_health', 'TILED': true},
            serverType: 'geoserver'
        }),
        visible: false
    }),
    gender_equality1: new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'gender_equality1', 'TILED': true},
            serverType: 'geoserver'
        }),
        visible: false
    }),
    quality_education: new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'quality_education', 'TILED': true},
            serverType: 'geoserver'
        }),
        visible: false
    })
};

document.querySelectorAll('.dropdown-content a').forEach(function (element) {
    element.addEventListener('click', function () {
        const selectedLayer = this.getAttribute('data-layer');
        Object.keys(layers).forEach(function (layer) {
            if (selectedLayer === 'no_selection') {
                layers[layer].setVisible(false);
            } else {
                layers[layer].setVisible(layer === selectedLayer);
            }
        });
        document.getElementById('mapTitle').innerText = this.innerText;
    });
});


// Create the map
const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        layers.no_poverty,
        layers.zero_hunger,
        layers.good_health,
        layers.gender_equality1,
        layers.quality_education
    ],
    view: new ol.View({
        center: [8790109.82, 2343497.07],
        projection: 'EPSG:3857',
        zoom: 4.5
    }),
});




