/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global google */

define(function () {
    'use strict';

    function GoogleMarker(providerMap, geoPosition, title) {
        var self = this;

        self._nativeMarker = new google.maps.Marker({
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

        self.addListener = function (eventName, listener) {
            if (eventName === 'click') {
                self._nativeMarker.addListener('click', function () {
                    listener(self);
                });
            } else {
                throw new Error('unknown event: ' + eventName);
            }
        };

        self._triggerMouseClick = function () {
            google.maps.event.trigger(self._nativeMarker, 'click', {
                latLng: self._nativeMarker.position
            });
        };
    }

    return GoogleMarker;

});



