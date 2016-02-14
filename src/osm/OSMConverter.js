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

    function OSMConverter(osmMap) {
        var self = this;
        self.osmMap = osmMap;

        self.toOsmLonLat = function (geoPosition) {
            return new OpenLayers.LonLat(geoPosition.longitude, geoPosition.latitude)
                    .transform(
                            osmMap.displayProjection, // transform from WGS 1984
                            osmMap.getProjectionObject() // to Spherical Mercator Projection
                            );
        };

        self.toGeoPosition = function (osmLonLat) {
            // Need new lonlat so that original osmLonLat is not affected by transformation
            var lonLatClone = new OpenLayers.LonLat(osmLonLat.lon, osmLonLat.lat);

            var position = lonLatClone.transform(
                    osmMap.getProjectionObject(),
                    osmMap.displayProjection);
            return {
                latitude: position.lat,
                longitude: position.lon
            };

        };
    }
    ;

    return OSMConverter;
});
