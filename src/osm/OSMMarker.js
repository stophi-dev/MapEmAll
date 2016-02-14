/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global OpenLayers */

define(function () {
    'use strict';

    function OSMMarker(osmConverter, nativeMarkerLayer, geoPosition, initialTitle) {
        var self = this;
        var markerTitle = initialTitle;

        self._nativeMarker = new OpenLayers.Marker(osmConverter.toOsmLonLat(geoPosition));
        nativeMarkerLayer.addMarker(self._nativeMarker);

        self.setGeoPosition = function (geoPosition) {
            nativeMarkerLayer.removeMarker(self._nativeMarker);
            self._nativeMarker.lonlat = osmConverter.toOsmLonLat(geoPosition);
            nativeMarkerLayer.addMarker(self._nativeMarker);
        };

        self.getGeoPosition = function () {

            var geoPosition = osmConverter.toGeoPosition(self._nativeMarker.lonlat);
            return geoPosition;
        };

        self.getTitle = function () {
            var children = getImageElements();
            for (var i = 0; i < children.length; i++) {
                var title = children[i].getAttribute('title');
                if (title) {
                    return title;
                }
            }
            return '';
        };

        self.setTitle = function (title) {
            getImageElements().forEach(function (child) {
                child.setAttribute('title', title);
                child.style.cursor = 'pointer';
            });
        };

        function getImageElements() {
            var imageDiv = self._nativeMarker.icon.imageDiv;
            return Array.prototype.slice.call(imageDiv.childNodes);
        }

        self.addListener = function (eventName, listener) {
            if (eventName === 'click') {
                self._nativeMarker.events.register('click', null, function () {
                    listener(self);
                });
            } else {
                throw new Error('unknown event: ' + eventName);
            }
        };

        self._triggerMouseClick = function () {
            var pixel = osmConverter.osmMap.getPixelFromLonLat(self._nativeMarker.lonlat);
            self._nativeMarker.events.triggerEvent('click', {xy: pixel});
        };

        self.setTitle(initialTitle);
    }

    return OSMMarker;

});