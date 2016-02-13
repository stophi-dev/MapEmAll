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
        var markers = [];

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

        this.addListener = function (event, listener) {
            if (event === 'boundsChanged') {
                var wrappedListener = function () {
                    listener();
                };
                Microsoft.Maps.Events.addHandler(self._nativeMap, 'viewchangeend', wrappedListener);

            } else if (event === 'click') {
                var wrappedListener = function (event) {
                    if (event.targetType === "map") {
                        var point = new Microsoft.Maps.Point(event.getX(), event.getY());
                        var bingLocation = event.target.tryPixelToLocation(point);
                        var geoPosition = {latitude: bingLocation.latitude, longitude: bingLocation.longitude};
                        listener(geoPosition);
                    }
                };
                Microsoft.Maps.Events.addHandler(self._nativeMap, 'click', wrappedListener);
            } else {
                throw 'unknown event: ' + event;
            }
        };

        self.getMarkers = function() {
            return markers.slice();
        };

        self.addMarker = function (geoPosition, title) {
            var result = new BingMarker(self._nativeMap, geoPosition, title);
            markers.push(result);
            return result;
        };

        this.clearAllMarkers = function () {
            self._nativeMap.entities.clear();
            markers = [];
        };

        this._triggerMouseClick = function (geoPosition) {
            Microsoft.Maps.Events.invoke(self._nativeMap, 'click', {
                eventName: 'click',
                getX: function () {
                    return self._nativeMap.tryLocationToPixel(geoPosition).x;
                },
                getY: function () {
                    return self._nativeMap.tryLocationToPixel(geoPosition).y;
                },
                isPrimary: true,
                isSecondary: false,
                isTouchEvent: false,
                mouseMoved: false,
                originalEvent: null,
                pageX: 0,
                pageY: 0,
                target: self._nativeMap,
                targetType: 'map',
                wheelDelta: 0
            });
        };
    };

    return BingMap;
});


