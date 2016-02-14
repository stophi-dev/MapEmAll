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

    var BingMarker = function (util, geoPosition, title) {
        var self = this;
        var pinId = 'bing_pushpin_' + loader.makeId(20);

        var location = toBingLocation(geoPosition);
        self._nativeMarker = new Microsoft.Maps.Pushpin(location, {id: pinId});
        util._nativeMap.entities.push(self._nativeMarker);

        addTooltipToPin(pinId, title);


        self.setGeoPosition = function (geoPosition) {
            self._nativeMarker.setLocation(toBingLocation(geoPosition));
        };

        self.getGeoPosition = function () {
            return toGeoPosition(self._nativeMarker.getLocation());
        };

        self.getTitle = function () {
            return getTooltipFromPin(pinId);
        };

        self.setTitle = function (title) {
            addTooltipToPin(pinId, title);
        };

        self.addListener = function (eventName, listener) {
            if (eventName === 'click') {
                Microsoft.Maps.Events.addHandler(self._nativeMarker, 'click', function () {
                    listener(self);
                });
            } else {
                throw new Error('unknown event: ' + eventName);
            }
        };

        self._triggerMouseClick = function () {
            util.invokeClickEventOnPushpin(self._nativeMarker, getMarkerPixel());
        };

        function getMarkerPixel() {
            return util._nativeMap.tryLocationToPixel(self._nativeMarker.getLocation());
        }
    };


    function addTooltipToPin(pinId, tooltipText) {
        var pinElement = document.getElementById(pinId);
        var children = Array.prototype.slice.call(pinElement.childNodes);
        children.forEach(function (child) {
            child.setAttribute('title', tooltipText);
            child.style.cursor = 'pointer';
        });
    }

    function getTooltipFromPin(pinId) {
        var pinElement = document.getElementById(pinId);
        var children = Array.prototype.slice.call(pinElement.childNodes);
        for (var i = 0; i < children.length; i++) {
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


