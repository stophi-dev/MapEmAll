/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global Microsoft */

define(['JSLoader'], function (loader) {
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
            var pinId = 'bing_pushpin_' + loader.makeId(20);

            var location = new Microsoft.Maps.Location(geoPosition.latitude, geoPosition.longitude);
            var pin = new Microsoft.Maps.Pushpin(location, {id: pinId});
            map.entities.push(pin);

            addTooltipToPin(pinId, title);
        };

        function addTooltipToPin(pinId, tooltipText) {
            var pinElement = document.getElementById(pinId);
            var children = Array.prototype.slice.call(pinElement.childNodes);
            children.forEach(function(child) {
                child.setAttribute('title', tooltipText);
            });
        }

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


