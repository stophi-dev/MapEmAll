/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global Microsoft */

define(['JSLoader', 'bing/BingMarker'], function (loader, BingMarker) {
    'use strict';

    var BingMap = function BingMap(options) {
        var self = this;
        var mapOptions = {
            credentials: options.credentials,
            center: new Microsoft.Maps.Location(options.center.latitude, options.center.longitude),
            zoom: 16
        };

        self._nativeMap = new Microsoft.Maps.Map(options.htmlContainer, mapOptions);
        self.getArea = function () {
            var bounds = self._nativeMap.getBounds();
            return {
                northEast: {
                    latitude: bounds.getNorth(),
                    longitude: bounds.getEast()
                },
                southWest: {
                    latitude: bounds.getSouth(),
                    longitude: bounds.getWest()
                }
            };
        };

        self.addMarker = function (geoPosition, title) {
            return new BingMarker(self._nativeMap, geoPosition, title);
        };

        this.addListener = function (event, listener) {
            if (event === 'boundsChanged') {
                Microsoft.Maps.Events.addHandler(self._nativeMap, 'viewchangeend', listener);
                // TODO maybe needs to be debounced, like google API
            }
        };

        this.clearAllMarkers = function () {
            self._nativeMap.entities.clear();
        };
    };

    return BingMap;
});


