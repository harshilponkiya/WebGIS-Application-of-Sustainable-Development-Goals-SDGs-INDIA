// Initialize the map for 'map_PC'
var map_np = new ol.Map({
    target: 'map_np',
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
var geoserverLayerSourcenp = new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/divya/wms/',
    params: {
        'LAYERS': 'divya:no_poverty',
        'TILED': true
    }
});

var layer_np = new ol.layer.Tile({
    source: geoserverLayerSourcenp
});

map_np.addLayer(layer_np);



function popupnp(map_np, geoserverLayerSourcenp) {
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

    map_np.addOverlay(overlay);

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    map_np.on('singleclick', function (evt) {
        var viewResolution = map_np.getView().getResolution();
        var coordinate = evt.coordinate;
        var url = geoserverLayerSourcenp.getFeatureInfoUrl(
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
                                        <p><span class="popup-label">Area (km²):</span> ${properties.Shape_Area/1000000}</p>
                                        <p><span class="popup-label">No Poverty:</span> ${properties.No_Poverty}</p>   
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