/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global Microsoft */

define(function () {
    'use strict';

    var BingMap = function BingMap(options) {
        var mapOptions = {
            credentials: options.credentials,
            center: new Microsoft.Maps.Location(options.center.latitude, options.center.longitude),
            zoom: 16
        };
        var map = new Microsoft.Maps.Map(options.htmlContainer, mapOptions);
        this.getArea = function () {
            var bounds = map.getBounds();
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
        this.addMarker = function (geoPosition, title) {

            var location = new Microsoft.Maps.Location(geoPosition.latitude, geoPosition.longitude);
            var pin = new Microsoft.Maps.Pushpin(location);
            map.entities.push(pin);
        };

        this.addListener = function (event, listener) {
            if (event === 'boundsChanged') {
                Microsoft.Maps.Events.addHandler(map, 'viewchangeend', listener);
                // TODO maybe needs to be debounced, like google API
            }
        };

        this.clearAllMarkers = function () {
            map.entities.clear();
        };
    };

    return BingMap;
});


