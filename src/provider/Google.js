/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

/* global google */

define(['JSLoader', 'provider/GoogleMap'], function (loader, GoogleMap) {
    'use strict';

    return {
        loadMap: function (options, callback) {
            var callbackName = 'initGoogleMap_' + loader.makeId(10);
            window[callbackName] = function () {
                delete window[callbackName];
                var googleMap = new GoogleMap(options);

                google.maps.event.addListenerOnce(googleMap.map, "bounds_changed", function () {
                    // for compatibility with other APIs: getArea() should be ready immediately:
                    callback(googleMap);
                });
            };
            var keyStr = options.credentials ? 'key=' + options.credentials + '&' : '';
            loader.loadjsfile('https://maps.googleapis.com/maps/api/js?' + keyStr + 'callback=' + callbackName);
        }
    };

});