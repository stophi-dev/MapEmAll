/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
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


