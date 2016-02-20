/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global Microsoft */

define(function () {
    'use strict';

    var BingMapUtil = function (nativeBingMap) {
        var self = this;
        self._nativeMap = nativeBingMap;

        self.toGeoPosition = function (bingLocation) {
            return {
                latitude: bingLocation.latitude,
                longitude: bingLocation.longitude
            };
        };

        self.pixelToGeoPosition = function (pixelX, pixelY) {
            var point = new Microsoft.Maps.Point(pixelX, pixelY);
            var bingLocation = self._nativeMap.tryPixelToLocation(point);
            return self.toGeoPosition(bingLocation);
        };

        self.invokeClickEventOnMap = function (pixel) {
            invokeClickEvent(self._nativeMap, 'map', pixel);
        };

        self.invokeClickEventOnPushpin = function (pushpin, pixel) {
            invokeClickEvent(pushpin, 'pushpin', pixel);
        };

        /**
         * Invoke a mouse click event (used for testing)
         * 
         * @param {type} targetBingElement element that should be clicked
         * @param {type} targetType The type of the object that fired the event. 
         * Valid values include the following: ‘map’, ‘polygon’, ‘polyline’, or ‘pushpin’
         * @param {type} pixel where the click event should be invoked
         * @returns {undefined}
         */
        function invokeClickEvent(targetBingElement, targetType, pixel) {
            Microsoft.Maps.Events.invoke(targetBingElement, 'click', {
                eventName: 'click',
                getX: function () {
                    return pixel.x;
                },
                getY: function () {
                    return pixel.y;
                },
                isPrimary: true,
                isSecondary: false,
                isTouchEvent: false,
                mouseMoved: false,
                originalEvent: null,
                pageX: 0,
                pageY: 0,
                target: targetBingElement,
                targetType: targetType,
                wheelDelta: 0
            });
        }
    };

    return BingMapUtil;
});
