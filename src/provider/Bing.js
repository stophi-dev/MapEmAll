/*
 * MapEmAll is licensed under the conditions of the MIT License (MIT)
 *
 * Copyright (c) 2015-2016 Philip Stöhrer
 * All rights reserved.
 *
 * See https://raw.githubusercontent.com/stophi-dev/MapEmAll/master/LICENSE for details.
 */

define(['JSLoader', 'provider/BingMap'], function (loader, BingMap) {
    'use strict';

    return {
        loadMap: function (options, callback) {
            var callbackName = 'initBingMap_' + loader.makeId(10);

            window[callbackName] = function () {
                delete window[callbackName];
                callback(new BingMap(options));
            };
            loader.loadjsfile('http://dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&onscriptload=' + callbackName);
        }
    };
});