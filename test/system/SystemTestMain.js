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

        $('#addMarkerToCenter').on('click', function() {
            var latitude = (map.getArea().northEast.latitude + map.getArea().southWest.latitude) / 2;
            var longitude = (map.getArea().northEast.longitude + map.getArea().southWest.longitude) / 2;

            map.addMarker({latitude: latitude, longitude: longitude}, 'Marker');
        });

        $('#clearAllMarkers').on('click', function() {
            map.clearAllMarkers();
        });

        function reloadMap(provider) {
            $('#map').remove();
            $('body').append('<div id="map"></div>');
            MapEmAll.htmlContainerId = 'map';
            MapEmAll.provider = provider;
            MapEmAll.loadMap(function(loadedMap) {
                map = loadedMap;
            });
        }

    });

});


