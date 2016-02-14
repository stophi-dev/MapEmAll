/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

define(function () {
    'use strict';

    require.config({
        baseUrl: '../../src',
        paths: {'jquery': '../test/system/lib/jquery-2.1.4.min'}
    });

    require(['Main', 'jquery'], function (MapEmAll, $) {
        MapEmAll.center = {"latitude": 48.137013636218676, "longitude": 11.576739173564974};
        MapEmAll.zoomLevel = 15;
        MapEmAll.osm.url = 'lib/openlayers/OpenLayers.js';

        var maps = {};

        $('.providerSelect').each(function () {
            if (this.checked) {
                loadMap(this.value);
            }
        });

        $('.providerSelect').on('change', function () {
            if (this.checked) {
                loadMap(this.value);
            } else {
                unloadMap(this.value);
            }
        });

        $('#clearAllMarkers').on('click', function () {
            Object.keys(maps).forEach(function (provider) {
                maps[provider].clearAllMarkers();
            });
        });

        function unloadMap(provider) {
            var mapElement = $('#' + provider);
            var parent = mapElement.parent();
            parent.remove();
            delete maps[provider];
        }

        function loadMap(provider) {
            $('#allMaps').append('<div class="mapContainer"><div id="' + provider + '" class="map"></div></div>');

            MapEmAll.htmlContainerId = provider;
            MapEmAll.provider = provider;
            MapEmAll.loadMap(function (map) {
                maps[provider] = map;
                var clickCount = 0;
                map.addListener('boundsChanged', function () {
                    var area = map.getArea();
                    $('#showNorthEast').text('Northeast: ' + geoLocationToString(area.northEast));
                    $('#showSouthWest').text(' Southwest: ' + geoLocationToString(area.southWest));
                });

                map.addListener('click', function (geoPosition) {
                    clickCount += 1;
                    var marker = map.addMarker(geoPosition, 'Marker ' + clickCount);
                    marker.addListener('click', function (clickedMarker) {
                        $('#showClickedMarker').text("Marker clicked: " + clickedMarker.getTitle());
                    });
                });
            });
        }

        function geoLocationToString(geoLocation) {
            return '(' + geoLocation.latitude + ', ' + geoLocation.longitude + ')';
        }

    });

});


