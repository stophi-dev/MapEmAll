/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
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

        var map = null;
        reloadMap($('#selectMapProvider').val());

        $('#selectMapProvider').on('change', function () {
            reloadMap(this.value);
        });

        $('#clearAllMarkers').on('click', function () {
            map.clearAllMarkers();
        });

        function reloadMap(provider) {
            $('#map').remove();
            $('body').append('<div id="map"></div>');
            $('#showArea').text('');

            MapEmAll.htmlContainerId = 'map';
            MapEmAll.provider = provider;
            MapEmAll.loadMap(function (loadedMap) {
                map = loadedMap;
                var clickCount = 0;
                map.addListener('boundsChanged', function () {
                    var area  = map.getArea();
                    $('#showNorthEast').text('Northeast: ' + geoLocationToString(area.northEast));
                    $('#showSouthWest').text(' Southwest: ' + geoLocationToString(area.southWest));
                });

                map.addListener('click', function (geoPosition) {
                    clickCount += 1;
                    var marker = map.addMarker(geoPosition, 'Marker ' + clickCount);
                    marker.addListener('click', function(clickedMarker) {
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


