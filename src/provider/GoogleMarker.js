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

        this._providerMarker = new google.maps.Marker({
            position: {lat: geoPosition.latitude, lng: geoPosition.longitude},
            map: providerMap,
            title: title
        });

        self.setGeoPosition = function (geoPosition) {
            self._providerMarker.setPosition({
                lat: geoPosition.latitude,
                lng: geoPosition.longitude});
        };

        self.getGeoPosition = function () {
            return {
                latitude: self._providerMarker.position.lat(),
                longitude: self._providerMarker.position.lng()};
        };

        self.getTitle = function () {
            return self._providerMarker.getTitle();
        };

        self.setTitle = function (title) {
            self._providerMarker.setTitle(title);
        };
    }

    return GoogleMarker;

});



