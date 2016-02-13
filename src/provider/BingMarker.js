/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global Microsoft */

define(['JSLoader'], function (loader) {
    'use strict';

    var BingMarker = function (providerMap, geoPosition, title) {
        var self = this;
        var pinId = 'bing_pushpin_' + loader.makeId(20);

        var location = toBingLocation(geoPosition);
        self._providerMarker = new Microsoft.Maps.Pushpin(location, {id: pinId});
        providerMap.entities.push(self._providerMarker);

        addTooltipToPin(pinId, title);


        self.setGeoPosition = function (geoPosition) {
            self._providerMarker.setLocation(toBingLocation(geoPosition));
        };

        self.getGeoPosition = function () {
            return toGeoPosition(self._providerMarker.getLocation());
        };

        self.getTitle = function () {
            return getTooltipFromPin(pinId);
        };

        self.setTitle = function (title) {
            addTooltipToPin(pinId, title);
        };
    };

    function addTooltipToPin(pinId, tooltipText) {
        var pinElement = document.getElementById(pinId);
        var children = Array.prototype.slice.call(pinElement.childNodes);
        children.forEach(function (child) {
            child.setAttribute('title', tooltipText);
        });
    }

    function getTooltipFromPin(pinId) {
        var pinElement = document.getElementById(pinId);
        var children = Array.prototype.slice.call(pinElement.childNodes);
        for (var i=0; i < children.length; i++) {
            var title = children[i].getAttribute('title');
            if (title) {
                return title;
            }
        }
        return '';
    }

    function toBingLocation(geoPosition) {
        return new Microsoft.Maps.Location(geoPosition.latitude, geoPosition.longitude);
    }

    function toGeoPosition(bingLocation) {
        return {latitude: bingLocation.latitude, longitude: bingLocation.longitude};
    }

    return BingMarker;
});


