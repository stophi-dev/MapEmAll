/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Philip Stöhrer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
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


