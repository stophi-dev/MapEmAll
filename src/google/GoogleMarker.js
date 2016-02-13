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

    function GoogleMarker(providerMap, geoPosition, title) {
        var self = this;

        this._nativeMarker = new google.maps.Marker({
            position: {lat: geoPosition.latitude, lng: geoPosition.longitude},
            map: providerMap,
            title: title
        });

        self.setGeoPosition = function (geoPosition) {
            self._nativeMarker.setPosition({
                lat: geoPosition.latitude,
                lng: geoPosition.longitude});
        };

        self.getGeoPosition = function () {
            return {
                latitude: self._nativeMarker.position.lat(),
                longitude: self._nativeMarker.position.lng()};
        };

        self.getTitle = function () {
            return self._nativeMarker.getTitle();
        };

        self.setTitle = function (title) {
            self._nativeMarker.setTitle(title);
        };
    }

    return GoogleMarker;

});



