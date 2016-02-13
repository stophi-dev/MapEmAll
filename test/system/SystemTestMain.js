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
                    $('#showArea').text(areaToString(map.getArea()));
                });

                map.addListener('click', function (geoPosition) {
                    clickCount += 1;
                    map.addMarker(geoPosition, 'Marker ' + clickCount);
                });
            });
        }

        function areaToString(area) {
            return 'Northeast: ' + geoLocationToString(area.northEast) +
                    ' Southwest: ' + geoLocationToString(area.southWest);
        }

        function geoLocationToString(geoLocation) {
            return '(' + geoLocation.latitude + ', ' + geoLocation.longitude + ')';
        }

    });

});


