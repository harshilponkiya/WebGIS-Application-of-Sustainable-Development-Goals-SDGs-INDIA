// Initialize the map for 'map_PC'
var map_ge = new ol.Map({
    target: 'map_ge',
    view: new ol.View({
        center: [80.79177015731213, 22.000720899771604], // Centered on India
        projection: 'EPSG:4326',
        zoom: 5
    }),
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ]
});

var geoserverLayerSourcege = new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/divya/wms/',
    params: {
        'LAYERS': 'divya:gender_equality1',
        'TILED': true
    }
});

var layer_ge = new ol.layer.Tile({
    source: geoserverLayerSourcege
});

map_ge.addLayer(layer_ge);
function popupge(map_ge, geoserverLayerSourcege) {
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    map_ge.addOverlay(overlay);

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    map_ge.on('singleclick', function (evt) {
        var viewResolution = map_ge.getView().getResolution();
        var coordinate = evt.coordinate;
        var url = geoserverLayerSourcege.getFeatureInfoUrl(
            coordinate, viewResolution, 'EPSG:4326',
            { 'INFO_FORMAT': 'application/json' }
        );
        console.log(url)

        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.features && data.features.length > 0) {
                        var feature = data.features[0];
                        var properties = feature.properties;
                        var formattedContent = `
                                    <div class="popup-content">
                                        <p><span class="popup-label">State:</span> ${properties.STATE}</p>
                                        <p><span class="popup-label">Area (km²):</span> ${properties.Shape_Area / 1000000}</p>
                                        <p><span class="popup-label">Quality Education:</span> ${properties.Gender_Equ}</p>
                                    </div>
                                `;
                        content.innerHTML = formattedContent;
                        overlay.setPosition(coordinate);
                    } else {
                        content.innerHTML = 'No feature information found.';
                        overlay.setPosition(coordinate);
                    }
                })
                .catch(error => {
                    console.error('Error fetching feature info:', error);
                    content.innerHTML = 'Error fetching feature info.';
                    overlay.setPosition(coordinate);
                });
        } else {
            overlay.setPosition(undefined);
            closer.blur();
        }
    });
}