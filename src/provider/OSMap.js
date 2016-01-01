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


