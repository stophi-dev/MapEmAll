/* 
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
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
            // TODO implement title to be a tooltip of marker 
            // title currently has no real effet
            return markerTitle;
        };

        self.setTitle = function (title) {
            markerTitle = title;
        };
    }

    return OSMMarker;

});