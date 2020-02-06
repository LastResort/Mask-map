(function () {
    var latlng = leafletResource.center;
    navigator.geolocation.getCurrentPosition(function(posi) {
        latlng = [posi.coords.latitude, posi.coords.longitude];
    });

    var maskData = $.ajax({
        url: leafletResource.maskDataUrl,
        dataType: "json",
        success: function (data) {
            console.log("Data Loaded");
            window.leafletResource.maskDataJson = data;
        }
    });

    $.when(maskData).done(function () {
        var map = L.map("map").setView(latlng, leafletResource.zoom);

        L.tileLayer(leafletResource.mapUrl, {
            attribution: leafletResource.attribute
        }).addTo(map);

        var geoJson = L.geoJson(leafletResource.maskDataJson, {
            pointToLayer: function (feature, latlng) {
                    var prop = feature.properties;
                    var range = parseInt(prop.mask_adult, 10) + parseInt(prop.mask_child, 10);
                    var _color = "grey";
                    if (range >= 100) {
                        _color = "green";
                    } else if (range >= 50) {
                        _color = "yello";
                    } else if (Range > 0) {
                        _color = "red";
                    }
                    return L.marker(latlng,
                    {
                        icon: L.icon({
                                ...leafletResource.icon,
                                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-" + _color +".png"
                        })
                    });
            },
            onEachFeature: function (feature, layer) {
                var prop = feature.properties;
                var popupText = "<h3 class='store-title'>"+prop.name+"</h3>\
                                <div class='store-info'>\
                                  <div>成人口罩: " + parseInt(prop.mask_adult, 10) + "</div>\
                                  <div>小孩口罩: " + parseInt(prop.mask_child, 10) + "</div>\
                                  <div>資料更新: " + prop.updated+ "</div>\
                                  <a target='_blank' href='https://www.google.com.tw/maps/place/"+prop.address+"'>"+prop.address+"</a><br>\
                                  "+ prop.phone +"\
                                </div>";
                layer.bindPopup(popupText);
            }
        });

        var markers = L.markerClusterGroup();
        markers.addLayer(geoJson);

        map.addLayer(markers);

        // 關掉 mask
        $(".lmask").hide();
    });
})();