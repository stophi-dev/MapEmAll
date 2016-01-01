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

/* global OpenLayers */

define(function () {
    'use strict';

    var OSMap = function (options) {

        var map = new OpenLayers.Map(options.htmlContainer.getAttribute('id'));
        map.displayProjection = new OpenLayers.Projection("EPSG:4326");
        map.addLayer(new OpenLayers.Layer.OSM());

        function toOsmLonLat(geoPosition) {
            return new OpenLayers.LonLat(geoPosition.longitude, geoPosition.latitude)
                    .transform(
                            map.displayProjection, // transform from WGS 1984
                            map.getProjectionObject() // to Spherical Mercator Projection
                            );
        }

        function toGeoPosition(osmLonLat) {
            var position = osmLonLat.transform(
                    map.getProjectionObject(),
                    map.displayProjection);
            return {
                latitude: position.lat,
                longitude: position.lon
            };
        }

        var zoom = 16;

        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);

        map.setCenter(toOsmLonLat(options.center), zoom);

        this.getArea = function () {
            // this only works when map is not rotated (north at top)
            var bounds = map.getExtent();

            return {
                northEast: toGeoPosition(new OpenLayers.LonLat(bounds.right, bounds.top)),
                southWest: toGeoPosition(new OpenLayers.LonLat(bounds.left, bounds.bottom))
            };
        };

        this.addListener = function (event, listener) {
            if (event === 'boundsChanged') {
                map.events.register("moveend", map, listener);
                map.events.register("zoomend", map, listener);
            }
        };

        // TODO remove listener function

        this.addMarker = function (geoPosition, title) {
            var lonLat = toOsmLonLat(geoPosition);
            markers.addMarker(new OpenLayers.Marker(lonLat));
        };

        this.clearAllMarkers = function () {
            // TODO could be improved ?!
            map.removeLayer(markers);
            markers.destroy();
            markers = new OpenLayers.Layer.Markers("Markers");
            map.addLayer(markers);

        };
    };

    return OSMap;
});


