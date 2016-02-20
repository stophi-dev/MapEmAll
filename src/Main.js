/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

define([], function () {
    'use strict';
    var providers = {
        bing: 'bing/Bing',
        google: 'google/Google',
        osm: 'osm/OSM'
    };

    var result = {
        center: {latitude: 0, longitude: 0},
        zoomLevel: 5,
        provider: 'osm',
        htmlContainerId: 'MapEmAll',
        bing: {
            credentials: null
        },
        google: {
            credentials: null
        },
        osm: {
            url: 'http://www.openlayers.org/api/OpenLayers.js'
        },
        getMapProviders: function () {
            return Object.keys(providers);
        }
    };

    result.loadMap = function (onMapReadyCallback) {
        onMapReadyCallback = typeof onMapReadyCallback === 'function' ? onMapReadyCallback : function () {};
        var htmlContainer = document.getElementById(result.htmlContainerId);
        if (htmlContainer === null) {
            throw new Error('Did not find element with id "' + result.htmlContainerId + "'");
        }

        var options = {
            center: result.center,
            zoomLevel: result.zoomLevel,
            htmlContainer: htmlContainer,
            bing: {
                credentials: result.credentials
            },
            google: {
                credentials: result.credentials
            },
            osm: {
                url: result.osm.url
            }
        };
        require([providers[result.provider]], function (mapProvider) {
            mapProvider.loadMap.apply(mapProvider, [options, onMapReadyCallback]);
        });
    };

    return result;
});