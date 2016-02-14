/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global Microsoft */

define(['./BingMarker', './BingMapUtil'], function (BingMarker, BingMapUtil) {
    'use strict';

    var BingMap = function BingMap(options) {
        var self = this;
        var markers = [];

        var mapOptions = {
            credentials: options.credentials,
            center: new Microsoft.Maps.Location(options.center.latitude, options.center.longitude),
            zoom: options.zoomLevel
        };

        self._nativeMap = new Microsoft.Maps.Map(options.htmlContainer, mapOptions);
        
        var util = new BingMapUtil(self._nativeMap);
        
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
                        listener(util.pixelToGeoPosition(event.getX(), event.getY()));
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
            var result = new BingMarker(util, geoPosition, title);
            markers.push(result);
            return result;
        };

        self.clearAllMarkers = function () {
            self._nativeMap.entities.clear();
            markers = [];
        };

        self._triggerMouseClick = function (geoPosition) {
            var pixel = self._nativeMap.tryLocationToPixel(geoPosition);
            util.invokeClickEventOnMap(pixel);            
        };
    };

    return BingMap;
});


