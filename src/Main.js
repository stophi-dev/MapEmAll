/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
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
        center: {latitude: 48.163166, longitude: 11.58289},
        provider: 'osm',
        htmlContainerId: 'MapEmAll',
        getMapProviders: function () {
            return Object.keys(providers);
        }
    };

    result.loadMap = function (onMapReadyCallback) {
        onMapReadyCallback = typeof onMapReadyCallback === 'function'
                ? onMapReadyCallback
                : function () {};
        var htmlContainer = document.getElementById(result.htmlContainerId);
        if (htmlContainer === null) {
            throw new Error('Did not find element with id "' + result.htmlContainerId + "'");
        }

        var options = {
            center: result.center,
            credentials: result.credentials,
            htmlContainer: htmlContainer
        };
        require([providers[result.provider]], function (mapProvider) {
            mapProvider.loadMap.apply(mapProvider, [options, onMapReadyCallback]);
        });
    };

    return result;
});