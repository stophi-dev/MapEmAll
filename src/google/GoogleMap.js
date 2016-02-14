/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global google */

define(['./GoogleMarker'], function (GoogleMarker) {
    'use strict';

    var GoogleMap = function (options) {
        var self = this;
        var markers = [];

        this._nativeMap = new google.maps.Map(options.htmlContainer, {
            center: {lat: options.center.latitude, lng: options.center.longitude},
            zoom: 16
        });

        this.getArea = function () {
            var northEast = self._nativeMap.getBounds().getNorthEast();
            var southWest = self._nativeMap.getBounds().getSouthWest();
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
                self._nativeMap.addListener('bounds_changed', wrappedListener);
            } else if (event === 'click') {
                var wrappedListener = function (location) {
                    listener({latitude: location.latLng.lat(),
                        longitude: location.latLng.lng()});
                };
                self._nativeMap.addListener('click', wrappedListener);
            } else {
                throw 'unknown event: ' + event;
            }
        };


        // TODO function to remove listeners

        this.addMarker = function (geoPosition, title) {
            var newMarker = new GoogleMarker(self._nativeMap, geoPosition, title);
            markers.push(newMarker);
            return newMarker;
        };

        this.getMarkers = function () {
            return markers.slice();
        };

        this.clearAllMarkers = function () {
            for (var i = 0; i < markers.length; i++) {
                markers[i]._nativeMarker.setMap(null);
            }
            markers = [];
        };

        this._triggerMouseClick = function (geoPosition) {
            google.maps.event.trigger(self._nativeMap, 'click', {
                latLng: new google.maps.LatLng(geoPosition.latitude, geoPosition.longitude)
            });
        };
    };

    return GoogleMap;
});


