/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global OpenLayers */

define(['osm/OSMConverter', 'osm/OSMMarker'], function (OSMConverter, OSMMarker) {
    'use strict';

    var OSMap = function (options) {
        var self = this;
        
        self._nativeMap = new OpenLayers.Map(options.htmlContainer.getAttribute('id'));
        self._nativeMap.displayProjection = new OpenLayers.Projection("EPSG:4326");
        self._nativeMap.addLayer(new OpenLayers.Layer.OSM());
        
        var zoom = 16;

        var nativeMarkerLayer = new OpenLayers.Layer.Markers("Markers");
        self._nativeMap.addLayer(nativeMarkerLayer);

        var osmConverter = new OSMConverter(self._nativeMap);
        self._nativeMap.setCenter(osmConverter.toOsmLonLat(options.center), zoom);

        this.getArea = function () {
            // this only works when map is not rotated (north at top)
            var bounds = self._nativeMap.getExtent();

            return {
                northEast: osmConverter.toGeoPosition(new OpenLayers.LonLat(bounds.right, bounds.top)),
                southWest: osmConverter.toGeoPosition(new OpenLayers.LonLat(bounds.left, bounds.bottom))
            };
        };

        this.addListener = function (event, listener) {
            if (event === 'boundsChanged') {
                self._nativeMap.events.register("moveend", self._nativeMap, listener);
                self._nativeMap.events.register("zoomend", self._nativeMap, listener);
            }
        };

        // TODO remove listener function

        this.addMarker = function (geoPosition, title) {
            var marker = new OSMMarker(osmConverter, nativeMarkerLayer, geoPosition, title);                        
            return marker;
        };

        this.clearAllMarkers = function () {
            // TODO could be improved ?!
            self._nativeMap.removeLayer(nativeMarkerLayer);
            nativeMarkerLayer.destroy();
            nativeMarkerLayer = new OpenLayers.Layer.Markers("Markers");
            self._nativeMap.addLayer(nativeMarkerLayer);

        };
    };

    return OSMap;
});


