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

/* global google */

define(function () {
    'use strict';

    var GoogleMap = function (options) {
        var self = this;
        var markers = [];

        this.map = new google.maps.Map(options.htmlContainer, {
            center: {lat: options.center.latitude, lng: options.center.longitude},
            zoom: 16
        });

        this.getArea = function () {
            var northEast = self.map.getBounds().getNorthEast();
            var southWest = self.map.getBounds().getSouthWest();
            return {
                northEast: {
                    latitude: northEast.lat(),
                    longitude: northEast.lng()
                },
                southWest: {
                    latitude: southWest.lat(),
                    longitude: southWest.lng()
                }
            };
        };

        this.addListener = function (event, listener) {
            if (event === 'boundsChanged') {
                var timeout;
                var wrappedListener = function () {
                    // - debounces google maps event
                    // - hides potential arguments from google API from this API
                    clearTimeout(timeout);
                    timeout = setTimeout(listener, 100);
                };
                self.map.addListener('bounds_changed', wrappedListener);
            } else {
                throw 'unknown event: ' + event;
            }
        };

        // TODO function to remove listeners

        this.addMarker = function (geoPosition, title) {
            var marker = new google.maps.Marker({
                position: {lat: geoPosition.latitude, lng: geoPosition.longitude},
                map: self.map,
                title: title
            });
            markers.push(marker);
        };

        this.clearAllMarkers = function () {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
        };
    };

    return GoogleMap;
});


